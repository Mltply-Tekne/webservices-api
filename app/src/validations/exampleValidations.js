vehicleFactorsSchema = {
    "type": "object",
    "properties": {
        "vehicles" : {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "vehicle_num": {
                        "type": "number"
                    },
                    "vin": {
                        "type": "string",
                        "minLength": 10
                    },
                    "id_year": {
                        "type": "number"
                    },
                    "id_make": {
                        "type": "number"
                    },
                    "id_model": {
                        "type": "number"
                    },
                    "id_bodystyle": {
                        "type": "number"
                    },
                    "id_dashcam": {
                        "type": "number"
                    },
                    "deliverytime_range_num": {
                        "type": "number"
                    },
                    "monthlymilage_num": {
                        "type": "number"
                    },
                    "id_telematicsparticipation": {
                        "type": "number"
                    },
                    "territory_zipcode": {
                        "type": "string"
                    },
                    "territory_channel": {
                        "type": "string"
                    },
                    "score_num": {
                        "type": "number"
                    }
                },
                "required": ["vehicle_num"],
                "anyOf": [
                    {
                        "required": [
                            "id_year",
                            "id_make",
                            "id_model",
                            "id_bodystyle"
                        ]
                    },
                    {
                        "required": [
                            "vin"
                        ]
                    },
                ]
            }
        }
    }
}


driversSchema = {
    "type": "object",
    "properties": {
        "drivers": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "age": {
                        "type": "number",
                        "range": [1, 100]
                    },
                    "points": {
                        "type": "number",
                        "range": [0, 5]
                    }
                },
                "required": ["age", "points"]
                
            }
        }
    }
    
}

module.exports = {driversSchema}