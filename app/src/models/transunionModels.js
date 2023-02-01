var Pg = require(`${process.env.srcPath}/config/postgres.js`);
var excelModule = require(`${process.env.srcPath}/config/excels.js`);
var mvrVhsValidationDate = require(`${process.env.srcPath}/config/businessRules.js`);



async function loadApiResponse(pParameters, pUser) {

    var mQuery = `
		insert into ${pUser}.mvr_violations
		(driverlicense, responsejson, responsetime)
		values
		($1, $2::json, $3)`

    result = await Pg.execute_query_transformation(mQuery, pParameters)
    return 
}

async function searchDriverLicense(pLicenceNumber, pUser){
	validationDate = mvrVhsValidationDate.mvrVhsValidationDate
	var mQuery = `
		SELECT responsejson
		FROM ${pUser}.mvr_violations
		WHERE responsedate::date >= current_date - interval '${validationDate}' day
		AND driverlicense = $1
		--AND 1<>1
		order by id desc
		`
	result = await Pg.execute_query(mQuery,[pLicenceNumber])
	return result[0]
}


async function searchMvrDescription(pEvcPrefix, pIdState){
  
	var mQuery = `
		SELECT evc_prefix, pnc_description, points
		from meta.mvr_mapping m 
		inner join meta.r_mvr_state rm on m.id_mvr = rm.id_mvr
		WHERE evc_prefix = $1
		and rm.id_state = $2
	`
	result = await Pg.execute_query(mQuery,[pEvcPrefix, pIdState])
	return result[0]

}

async function getStatesWithMvrMapping(){

	var mQuery = `
		select short_desc
		from meta.state
		where id_state in (select distinct id_state from meta.r_mvr_state)
	`
	result = []
	queryResult = await Pg.execute_query(mQuery)
	var stateList = []
	for(var state in queryResult){
		stateList.push(queryResult[state].short_desc)
	}
	return stateList
}

async function getStatePerDescription(mShortStateDesciption){

	var mQuery = `
		select id_state, short_desc, description, violation_months_limit
		from meta.state
		where short_desc = $1
	`
	result = await Pg.execute_query(mQuery,[mShortStateDesciption])
	return result[0]
}



async function initializeClient(pNewClient){

	// Schema creation
	var mQuery = `
		CREATE SCHEMA IF NOT EXISTS ${pNewClient}
	`
	result = await Pg.execute_query_transformation(mQuery, [])
	
	// Table creation
	mQuery = `
		CREATE TABLE IF NOT EXISTS ${pNewClient}.mvr_violations
		(
			id serial,
			driverlicense character varying(100) COLLATE pg_catalog."default" NOT NULL,
			responsedate timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
			responsejson json NOT NULL,
			responsetime numeric(18,2) NOT NULL
		)
	`
	await Pg.execute_query_transformation(mQuery, [])

	// Table creation
	mQuery = `
		CREATE TABLE IF NOT EXISTS ${pNewClient}.vhs_score
		(
			id serial,
			responsedate timestamp without time zone DEFAULT now(),
			score integer,
			responsetime numeric(18,2),
			id_vin character varying(1700) COLLATE pg_catalog."default",
			CONSTRAINT vhs_score_pkey PRIMARY KEY (id)
		)
	`
	await Pg.execute_query_transformation(mQuery, [])

	// Index creation
	mQuery = `
		CREATE INDEX IF NOT EXISTS ${pNewClient}_mvr_violations
		ON ${pNewClient}.mvr_violations
		(driverlicense)
	`
	await Pg.execute_query_transformation(mQuery, [])
	
	return 'ok'
}

async function insertVhsVehiclesScore(pParameters, pUser){

	var mQuery =
	`INSERT into ${pUser}.vhs_score(
		score, responsetime, id_vin
	) VALUES ($1, $2, $3) RETURNING id;
	`

	result = await Pg.execute_query_transformation(mQuery,pParameters)
	return result

}

async function getVhsScore(pVinsId, pUser){
	validationDate = mvrVhsValidationDate.mvrVhsValidationDate
	mQuery = 
	`SELECT score
	FROM ${pUser}.vhs_score v1 
	WHERE v1.id_vin = $1
	and v1.responsedate::date >= current_date - interval '${validationDate}' day
	order by id desc
	`

	result = await Pg.execute_query(mQuery,[pVinsId])
	return result[0]

}
module.exports = {loadApiResponse, searchDriverLicense, searchMvrDescription, getStatesWithMvrMapping, getStatePerDescription, initializeClient, insertVhsVehiclesScore,getVhsScore}



