var PgPouch = require(`${process.env.srcPath}/config/postgres_pouch.js`);
var PgStable = require(`${process.env.srcPath}/config/postgres_stable.js`);
var excelModule = require(`${process.env.srcPath}/config/excels.js`);



async function getPouchUpdates(requestParameters) {

	whereConditions = ''

	if (requestParameters['yearMonth'] != undefined) {
		whereConditions += `and to_char(quotedate, 'yyyymm') = ANY($1)
		`
	}else{
		requestParameters['yearMonth'] = ''
	}
	
	if (requestParameters['businessState'] != undefined) {
		whereConditions += `and businessstate_txt = ANY($2)
		`
	}else{
		requestParameters['businessState'] = ''
	}

	if (requestParameters['agentGroupId'] != undefined) {
		whereConditions += `and agentgroupid = ANY($3::int[])
		`
	}else{
		requestParameters['agentGroupId'] = ''
	}

	if (requestParameters['pouchPolicyNumber'] != undefined) {
		whereConditions += `and pouchpolicynumber_txt = ANY($4)
		`
	}else{
		requestParameters['pouchPolicyNumber'] = ''
	}

	if (requestParameters['saleStage'] != undefined) {
		whereConditions += `and last_salestage = ANY($5)
		`
	}else{
		requestParameters['saleStage'] = ''
	}

    var baseQuery = `
		select 
			* 
		from (
						---policy master
						SELECT 
							saledate as "SaleDate",
							policyoriginalsaledate "PolicyOriginalSaleDate",
							last_salestage "SaleStage",
							pouchpolicynumber_txt "PouchPolicyNumber_txt",
							contactfullname_txt "ContactFullName_txt",
							contactemail_txt "ContactEmail_txt",
							salespersonname "SalesPersonName",
							salespersonemail "SalesPersonEmail",
							quotedate "QuoteDate",
							businesssubclass_txt "BusinessSubClass_txt",
							quoteref "QuoteRef",
							daysinpolicyyear_num "DaySinPolicyYear_Num",
							agentgroupname "AgentGroupName",
							agentgrouprefid "AgentGroupRefId",
							external_agentgroupaddressformatted2_txt "External_AgentGroupAddressFormatted2_txt",
							agentgroupaddressdisplayline1_txt "AgentGroupAddressDisplayLine1_txt",
							cb_payplantype_txt "Cb_PayPlanType_txt",
							finalpremiummonthlyincltaxes_num "FinalPremiumMonthlyInclTaxes_Num",
							finalpremiummonthly_num "FinalPremiumMonthly_Num",
							finalpremiumannualincltaxes_num "FinalPremiumAnnualInclTaxes_Num",
							feetaxes_num "FeeTaxes_Num",
							cb_downpayment_num "Cb_DownPayment_Num",
							businessstate_txt "BusinessState_txt",
							businesszip_txt as "BusinessZip_txt",
							businesscity_txt as "BusinessCity_txt",
							businessnamedba_txt "BusinessNameDba_txt",
							pq.businessaddressline1_txt "BusinessAddressLine1_txt",
							contactphone_txt "ContactPhone_txt",
							pm.policyeffective_date "PolicyEffective_Date",
							policyexpiration_date "PolicyExpiration_Date",
							policyfee_num "PolicyFee_Num",
							exists( select 1 from policymaster where renewalof = pm.policyid) was_renewed,
							pm.originatedfrom
						FROM public.policymaster pm
						inner join public.policyquotes pq on pm.last_quoteref = pq.quoteref 
						where agentgroupname = 'Pouch Insurance Agency'
				
						`
						+ whereConditions +
						`
						union all

						--quote
						SELECT 
							null as "SaleDate",
							policyoriginalsaledate "PolicyOriginalSaleDate",
							last_salestage "SaleStage",
							pouchpolicynumber_txt "PouchPolicyNumber_txt",
							contactfullname_txt "ContactFullName_txt",
							null "ContactEmail_txt",
							salespersonname "SalesPersonName",
							salespersonemail "SalesPersonEmail",
							quotedate "QuoteDate",
							businesssubclass_txt "BusinessSubClass_txt",
							quoteref "QuoteRef",
							daysinpolicyyear_num "DaySinPolicyYear_Num",
							agentgroupname "AgentGroupName",
							agentgrouprefid "AgentGroupRefId",
							external_agentgroupaddressformatted2_txt "External_AgentGroupAddressFormatted2_txt",
							agentgroupaddressdisplayline1_txt "AgentGroupAddressDisplayLine1_txt",
							cb_payplantype_txt "Cb_PayPlanType_txt",
							finalpremiummonthlyincltaxes_num "FinalPremiumMonthlyInclTaxes_Num",
							finalpremiummonthly_num "FinalPremiumMonthly_Num",
							finalpremiumannualincltaxes_num "FinalPremiumAnnualInclTaxes_Num",
							feetaxes_num "FeeTaxes_Num",
							cb_downpayment_num "Cb_DownPayment_Num",
							businessstate_txt "BusinessState_txt",
							null as "BusinessZip_txt",
							null as "BusinessCity_txt",
							businessnamedba_txt "BusinessNameDba_txt",
							businessaddressline1_txt "BusinessAddressLine1_txt",
							contactphone_txt "ContactPhone_txt",
							policyeffective_date "PolicyEffective_Date",
							policyexpiration_date "PolicyExpiration_Date",
							policyfee_num "PolicyFee_Num",
							null was_renewed,
							originatedfrom
						FROM public.quote
						where last_record = true
						and has_policy = false
						and agentgroupname = 'Pouch Insurance Agency'
						`
						+ whereConditions +
						`
		) as agencyUpdate
		`
		
	result = await PgPouch.execute_query(baseQuery, [requestParameters['yearMonth'], requestParameters['businessState'], requestParameters['agentGroupId'], requestParameters['pouchPolicyNumber'], requestParameters['saleStage']])
    return await result

}



async function getAgencyUpdates(requestParameters) {

	whereConditions = ''

	if (requestParameters['yearMonth'] != undefined) {
		whereConditions += `and to_char(quotedate, 'yyyymm') = ANY($1)
		`
	}else{
		requestParameters['yearMonth'] = ''
	}
	
	if (requestParameters['businessState'] != undefined) {
		whereConditions += `and businessstate_txt = ANY($2)
		`
	}else{
		requestParameters['businessState'] = ''
	}

	if (requestParameters['agentGroupId'] != undefined) {
		whereConditions += `and agentgroupid = ANY($3::int[])
		`
	}else{
		requestParameters['agentGroupId'] = ''
	}

	if (requestParameters['pouchPolicyNumber'] != undefined) {
		whereConditions += `and pouchpolicynumber_txt = ANY($4)
		`
	}else{
		requestParameters['pouchPolicyNumber'] = ''
	}

	if (requestParameters['saleStage'] != undefined) {
		whereConditions += `and last_salestage = ANY($5)
		`
	}else{
		requestParameters['saleStage'] = ''
	}

    var baseQuery = `
		select 
			* 
		from (
				---policy master
						SELECT 
							saledate as "SaleDate",
							policyoriginalsaledate "PolicyOriginalSaleDate",
							last_salestage "SaleStage",
							pouchpolicynumber_txt "PouchPolicyNumber_txt",
							contactfullname_txt "ContactFullName_txt",
							contactemail_txt "ContactEmail_txt",
							salespersonname "SalesPersonName",
							salespersonemail "SalesPersonEmail",
							quotedate "QuoteDate",
							businesssubclass_txt "BusinessSubClass_txt",
							quoteref "QuoteRef",
							daysinpolicyyear_num "DaySinPolicyYear_Num",
							agentgroupname "AgentGroupName",
							agentgrouprefid "AgentGroupRefId",
							external_agentgroupaddressformatted2_txt "External_AgentGroupAddressFormatted2_txt",
							agentgroupaddressdisplayline1_txt "AgentGroupAddressDisplayLine1_txt",
							cb_payplantype_txt "Cb_PayPlanType_txt",
							finalpremiummonthlyincltaxes_num "FinalPremiumMonthlyInclTaxes_Num",
							finalpremiummonthly_num "FinalPremiumMonthly_Num",
							finalpremiumannualincltaxes_num "FinalPremiumAnnualInclTaxes_Num",
							feetaxes_num "FeeTaxes_Num",
							cb_downpayment_num "Cb_DownPayment_Num",
							businessstate_txt "BusinessState_txt",
							businesszip_txt as "BusinessZip_txt",
							businesscity_txt as "BusinessCity_txt",
							businessnamedba_txt "BusinessNameDba_txt",
							pq.businessaddressline1_txt "BusinessAddressLine1_txt",
							contactphone_txt "ContactPhone_txt",
							pm.policyeffective_date "PolicyEffective_Date",
							policyexpiration_date "PolicyExpiration_Date",
							policyfee_num "PolicyFee_Num",
							exists( select 1 from policymaster where renewalof = pm.policyid) was_renewed,
							pm.originatedfrom
						FROM public.policymaster pm
						inner join public.policyquotes pq on pm.last_quoteref = pq.quoteref 
						where agentgroupname <> 'Pouch Insurance Agency'
						`
						+ whereConditions +
						`
						union all

						--quote
						SELECT 
							null as "SaleDate",
							policyoriginalsaledate "PolicyOriginalSaleDate",
							last_salestage "SaleStage",
							pouchpolicynumber_txt "PouchPolicyNumber_txt",
							contactfullname_txt "ContactFullName_txt",
							null "ContactEmail_txt",
							salespersonname "SalesPersonName",
							salespersonemail "SalesPersonEmail",
							quotedate "QuoteDate",
							businesssubclass_txt "BusinessSubClass_txt",
							quoteref "QuoteRef",
							daysinpolicyyear_num "DaySinPolicyYear_Num",
							agentgroupname "AgentGroupName",
							agentgrouprefid "AgentGroupRefId",
							external_agentgroupaddressformatted2_txt "External_AgentGroupAddressFormatted2_txt",
							agentgroupaddressdisplayline1_txt "AgentGroupAddressDisplayLine1_txt",
							cb_payplantype_txt "Cb_PayPlanType_txt",
							finalpremiummonthlyincltaxes_num "FinalPremiumMonthlyInclTaxes_Num",
							finalpremiummonthly_num "FinalPremiumMonthly_Num",
							finalpremiumannualincltaxes_num "FinalPremiumAnnualInclTaxes_Num",
							feetaxes_num "FeeTaxes_Num",
							cb_downpayment_num "Cb_DownPayment_Num",
							businessstate_txt "BusinessState_txt",
							null as "BusinessZip_txt",
							null as "BusinessCity_txt",
							businessnamedba_txt "BusinessNameDba_txt",
							businessaddressline1_txt "BusinessAddressLine1_txt",
							contactphone_txt "ContactPhone_txt",
							policyeffective_date "PolicyEffective_Date",
							policyexpiration_date "PolicyExpiration_Date",
							policyfee_num "PolicyFee_Num",
							null was_renewed,
							originatedfrom
						FROM public.quote
						where last_record = true
						and has_policy = false
						and agentgroupname <> 'Pouch Insurance Agency'
						`
						+ whereConditions +
						`
		) as agencyUpdate
		`



	result = await PgPouch.execute_query(baseQuery, [requestParameters['yearMonth'], requestParameters['businessState'], requestParameters['agentGroupId'], requestParameters['pouchPolicyNumber'], requestParameters['saleStage']])
    return await result

}


async function getDailySales(requestParameters){

	whereConditions = ''

	if (requestParameters['businessState'] != undefined)
		{whereConditions += `and businessstate_txt = ANY($1)`
	}else{
		requestParameters['businessState'] = ''
	}
	if (requestParameters['agentGroupRefId'] != undefined)
		{whereConditions += `and agentgrouprefid = ANY($2::int[])}`
	}else{
		requestParameters['agentGroupRefId'] = ''
	}
	if (requestParameters['PolicyNumber'] != undefined)
		{whereConditions += ` and "PolicyNumberSuffixed" = ANY($3)`
	}else{
		requestParameters['PolicyNumber'] = ''
	}
	if (requestParameters['saleStage'] != undefined){
		whereConditions += `and "SaleStage" = ANY ($4)`
	}else{
		requestParameters['saleStage'] = ''
	}
	if (requestParameters['yearMonth'] != undefined){
		whereConditions += `and to_char("QuoteDate", 'yyyymm') = ANY($5) `
	}else{
		requestParameters['yearMonth'] = ''
	}
	var baseQuery = `

	SELECT
	"QuoteDate",
	"QuoteRef",
	"PolicyNumberSuffixed",
	"SaleStage",
	"PolicyEffective_Date",
	"PolicyExpiration_Date",
	"InsuredFullName_txt",
	"Email_txt",
	"Phone_txt",
	"dashcamtype_txt",
	"TotalPremiumInclFees_Num",
	"PayPlan_txt"
	
	FROM(
		SELECT 
		quotedate "QuoteDate",
		quoteref "QuoteRef",
		policynumbersuffixed "PolicyNumberSuffixed",
		salestage "SaleStage",	
		policyoriginalsaledate "PolicyOriginalSaleDate",
		pm.policyeffective_date "PolicyEffective_Date",
		policyexpiration_date "PolicyExpiration_Date",	
		contactfullname_txt "InsuredFullName_txt",	
		contactemail_txt "Email_txt",
		contactphone_txt "Phone_txt",
		dashcamtype_txt,
		finalpremiumannualincltaxes_num "TotalPremiumInclFees_Num",
		cb_payplantype_txt "PayPlan_txt",
		agentgroupname "QuoteStartedByAgentGroupName",
		businessstate_txt,
		policynumber 
		FROM public.policymaster pm
		inner join public.policyquotes pq on pm.last_quoteref = pq.quoteref 
		
		union all
		
		--quote
		SELECT 
			quotedate "QuoteDate",
			quoteref "QuoteRef",
			PolicyNumberSuffixed "PolicyNumberSuffixed",
			salestage "SaleStage",	
			policyoriginalsaledate "PolicyOriginalSaleDate",
			policyeffective_date "PolicyEffective_Date",
			policyexpiration_date "PolicyExpiration_Date",	
			contactfullname_txt "InsuredFullName_txt",	
			contactemail_txt "Email_txt",
			contactphone_txt "Phone_txt",
			dashcamtype_txt,
			finalpremiumannualincltaxes_num "TotalPremiumInclFees_Num",
			cb_payplantype_txt "PayPlan_txt",
			agentgroupname "QuoteStartedByAgentGroupName",
			businessstate_txt,
			null as policynumber 

		FROM public.quote
		where last_record = true
		and has_policy = false
		ORDER BY "QuoteDate"
		) as sub
		where 1 = 1
				`
		+ whereConditions
	result = await PgStable.execute_query(baseQuery,[requestParameters['businessState'],requestParameters['agentGroupRefId'],requestParameters['PolicyNumber'],requestParameters['saleStage'],requestParameters['yearMonth']])
	return await result

}

async function getAboutToExpireInfo(requestParameters){
	
	whereConditions = ''

	if(requestParameters['businessState']!= undefined)
		{whereConditions += `and businessstate_txt = ANY($1)`
	}else{
		requestParameters['businessState'] = ''
	}
	if(requestParameters['aboutToExpire'] != undefined){
		whereConditions += `and AboutToExpire = ANY($2::int[])` 
	}else{
		requestParameters['aboutToExpire'] = ''	
	}
	if(requestParameters['saleStage'] != undefined)
		{whereConditions += `and SaleStage = ANY($3)`
	}else{
		requestParameters['saleStage'] = ''
	}
	if(requestParameters['yearMonth'] != undefined){
		whereConditions += `and to_char(enddate, 'yyyymm') = ANY($4)`
	}else{
		requestParameters['yearMonth'] = ''
	}
	var baseQuery =`
	SELECT SaleStage,
		policyoriginalsaledate,
		policyeffective_date,
		policyexpiration_date,
		policynumber,
		quoteref,
		copyrequoteof,
		contactfullname_txt,
		agentgroupname,
		businessstate_txt,
		cb_payplantype,
		transactiontype_txt,
		FinalPremiumAnnualInclTaxes_NUM,
		requoted_amount,
		enddate

	 FROM (
		SELECT 
		pm.last_salestage as SaleStage,
		pm.policyoriginalsaledate, 
		pm.policyeffective_date,
		pm.policyexpiration_date,
		pq.pouchpolicynumber_txt as policynumber,
		pm.last_quoteref quoteref,
		pm.copyrequoteof,
		pq.contactfullname_txt,
		pm.agentgroupname, 
		pq.businessstate_txt,
		pq.cb_payplantype_txt as cb_payplantype, 
		pm.last_transactiontype_txt as transactiontype_txt, 
		pq.FinalPremiumAnnualInclTaxes_NUM,
		pm.requoted_amount,
		pm.enddate,
		case 	when EXTRACT(DAY FROM enddate-now()) < 0 then 1
				when EXTRACT(DAY FROM (enddate-now())) >= 0 and EXTRACT(DAY FROM enddate-now()) <= 1 then 2
				when EXTRACT(DAY FROM enddate-now()) <= 15 then 3              
				when EXTRACT(DAY FROM enddate-now()) <= 30 then 4
				when EXTRACT(DAY FROM enddate-now()) <= 60 then 5
				when EXTRACT(DAY FROM enddate-now()) > 60 then 6
		end as AboutToExpire,
		exists( select 1 from policymaster where renewalof = pm.policyid ) was_renewed
		FROM public.policymaster pm
		inner join public.policyquotes pq on pm.last_quoteref = pq.quoteref
		)
		as sub
		WHERE was_renewed = false
		`
		+ whereConditions
	result = await PgPouch.execute_query(baseQuery,[requestParameters['businessState'],requestParameters['aboutToExpire'],requestParameters['saleStage'],requestParameters['yearMonth']])
	return await result

}

async function getNextDueDate(){
	var baseQuery = 
	`SELECT 
	policyid,
	min(duedate) next_duedate, 
	case when count(policyid) = 1 then 'PIF' else 'Monthly' end as pay_plan
	from authorize.duedates
	where duedate >= NOW()
	group by policyid
	order by min(duedate)`

	result = await PgPouch.execute_query(baseQuery)
	return await result
}

module.exports = {getPouchUpdates, getAgencyUpdates, getDailySales, getAboutToExpireInfo, getNextDueDate}