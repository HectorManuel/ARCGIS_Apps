define(['dojo/_base/kernel', 
        'dojo/i18n'
],
function (kernel, i18n) {
    return {
        //Returns a where clause with the listed lstInClauseValues contained within an IN operator.
        //@param (string)inClauseField - The in clause field used for the IN operator
        //@param (Object[])lstInClauseValues - The array of objects to be inside the in operator
        //@return (string) A where clause including an IN operator. 
        //( Example: "inClauseField IN (lstInClauseValues[0], lstInClauseValues[1]...lstInClauseValues[n])" )
        GetWhereClauseUsingInOperator: function(inClauseField, lstInClauseValues) {
            var whereClause = "";

            whereClause += inClauseField + " IN (";

            for (n = 0; n < lstInClauseValues.length; n++) {
                whereClause += "'" + lstInClauseValues[n] + "'";

                if (n != lstInClauseValues.length - 1)
                    whereClause += ", ";
                else
                    whereClause += ") "; // last iteration
            }

            return whereClause;
        },

        //Returns a where clause wiht the minimalValueClause and maximumValueClause contained within a BETWEEN operator.
        //@param (string)clauseField - The clause field used for the BETWEEN operator
        //@param (string|number|Date)minimumValueClause - The minimum value to be included
        //@param (string|number|Date)maximumValueClause - The maximum value to be included
        //@return (string) A where clause including a BETWEEN operator or "1=1" if no value or an empty string is provided
        //for the minimumClauseField or maximumClauseField.
        //(Example: "clauseField BETWEEN minimumClauseValue AND maximumClauseValue" ) 
        GetClauseUsingBetweenOperator: function(clauseField, minimumValueClause, maximumValueClause)
        {
            if ((minimumValueClause != null || minimumValueClause != " " || minimumValueClause != "") && 
                (maximumValueClause != null || maximumValueClause != " " || maximumValueClause != "")) {
                return clauseField + " BETWEEN '" + minimumValueClause + "' AND '" + maximumValueClause + "'";
            }
            else {
                return "1=1";
            }
        },
        
        GetDateClauseUsingBetweenOperator: function(clauseField, minimumValueClause, maximumValueClause)
        {
            if ((minimumValueClause != null || minimumValueClause != " " || minimumValueClause != "") && 
                (maximumValueClause != null || maximumValueClause != " " || maximumValueClause != "")) {
                return clauseField + " BETWEEN '" + minimumValueClause + "' AND '" + maximumValueClause + "'";
            }
            else {
                return "1=1";
            }
        }
    };
});