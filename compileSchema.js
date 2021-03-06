// This file precomputes fields needed by the query files.
// Don't look for rhyme or reason in the selection of fields here,
// they're purely driven by the needs of the queries.

var Set = require('set-component');

function verifyParams(entitySchemas, tableSchemas) {
  // TODO: ensure that schemas are valid
}

// returns <Map> entityKey -> [tableName]
function makeTablesContainingEntityField(entitySchema, tableSchemas) {
  var entityFields = Object.keys(entitySchema.fields);

  return entityFields.reduce(function(acc, targetEntityField) {
    var tableNames = tableSchemas
      .map(function getTableNamesOrNulls(tableSchema) {

        var referencingKeys = Object.keys(tableSchema.fields)
          .filter(function fieldReferencesDesiredKey(tableFieldName) {
            return tableSchema[tableFieldName] === targetEntityField;
          });

        return referencingKeys.length ? tableSchema.tableName : null;
      })
      .filter(function(x) { return x !== null });

    acc[targetEntityField] = tableNames;
    return acc;
  }, {});
}

// returns <Map> tableName -> [tableKey]
function makeTableKeysForTable(entitySchema, tableSchemas) {
  return tableSchemas
    .map(function(tableSchema) {
      return [tableSchema.name, tableSchema.keys];
    })
    .reduce(function(acc, keyValuePair) {
      acc[keyValuePair[0]] = keyValuePair[1];
      return acc;
    }, {});
}

// returns <Map> tableName -> tableFieldName -> entityFieldName
function makeEntityFieldNameFromTableFieldName(entitySchema, tableSchemas) {
  return tableSchemas
    .map(function(tableSchema) {
      return [tableSchema.tableName, tableSchema.fields];
    })
    .reduce(function(acc, keyValuePair) {
      acc[keyValuePair[0]] = keyValuePair[1];
      return acc;
    }, {});
}

// returns <Map> tableName -> [tableFieldName]
function makeTableNonKeyFieldsByTable(entitySchema, tableSchemas) {
  return tableSchemas
    .map(function(tableSchema){

    })
    .reduce(function(acc, keyValuePair){
      acc[keyValuePair[0]] = keyValuePair[1];
      return acc;
    }, {});
}

// returns <Fn> entity -> [missingFieldName]
function makeRequiredFieldsAreMissing(entitySchema, tableSchemas) {
  var requiredFields = Object.keys(entitySchema.fields)
    .map(function(fieldName) {
      var fieldSchema = entitySchema.fields[fieldName];

      return fieldSchema.required ? fieldName : null;
    })
    .filter(Boolean);

  return function(entity) {
    var missingKeys = requiredFields
      .map(function(keyName) {
        return entity[keyName] ? null : keyName;
      })
      .filter(Boolean);

    return missingKeys;
  };
}

// returns [tableNames]
function makeAllTableNames(entitySchema, tableSchemas) {
  return tableSchemas.map(function(tableSchema) { return tableSchema.tableName; });
}

// TODO
// returns tableName -> [tableFieldName]
function makeUnorderedFieldsByTable(entitySchema, tableSchemas) {

}

function allEntityFieldNames(entitySchema, tableSchemas) {
  return Object.keys(entitySchema.fields);
}

module.exports = function compileSchema(entitySchema, tableSchemas) {
  verifyParams(entitySchema, tableSchemas);

  var compiledSchema = {};

  compiledSchema.tablesContainingEntityField = makeTablesContainingEntityField(entitySchema, tableSchemas);
  compiledSchema.tableKeysByTable = makeTableKeysForTable(entitySchema, tableSchemas);
  compiledSchema.entityFieldNameByTableFieldName = makeEntityFieldNameFromTableFieldName(entitySchema, tableSchemas);
  compiledSchema.tableNonKeyFieldsByTable = makeTableNonKeyFieldsByTable(entitySchema, tableSchemas);
  compiledSchema.requiredFieldsAreMissing = makeRequiredFieldsAreMissing(entitySchma, tableSchemas);
  compiledSchema.allTableNames = makeAllTableNames(entitySchma, tableSchemas);
  compiledSchema.unorderedFieldsByTable = makeUnorderedFieldsByTable(entitySchema, tableSchemas);
  compiledSchema.allEntityFieldNames = makeAllEntityFieldNames(entitySchma, tableSchemas);

  return compiledSchema;
}
