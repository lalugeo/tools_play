var SqlExecutor = $.import("sap.hana.testtools.unit.util", "sqlExecutor").SqlExecutor;
var tableDataSet = $.import('sap.hana.testtools.unit.util', 'tableDataSet');
var mockstarEnvironment = $.import("sap.hana.testtools.mockstar", "mockstarEnvironment");
var tmpPackage = 'testtools.db.test.' + mockstarEnvironment.userSchema; 
describe("sample test suite", function() {
	var testEnvironment = null;

	beforeEach(function() {
		var definition = {
		    targetPackage : tmpPackage,
		    schema : mockstarEnvironment.userSchema,
		    model : {
		        schema :  mockstarEnvironment.userSchema,
		        name : 'testtools.db/test1' //e.g. package/MODEL
		    },
		    substituteTables : {
		        "tab1" : {
			        name : 'testtools.db::tabs.tab1'
		        },
		        "tab2" : {
			        name : 'testtools.db::tabs.tab2'
		        }
		    }
		};
		testEnvironment = mockstarEnvironment.defineAndCreate(definition);
		console.log($.session);
	});

	it("not ok", function() {
		expect(0).toBe(1);
	});
	
	it("mockstar test",function(){
		testEnvironment.fillTestTable("tab1", {
		    col1 : 10,
		    col2 : 10
		});
		
		testEnvironment.fillTestTable("tab1", {
		    col1 : 20,
		    col2 : 20
		});
		
		
		testEnvironment.fillTestTable("tab2", {
		    col3 : 5,
		    col4 : 5
		});
		
		testEnvironment.fillTestTable("tab2", {
		    col3 : 15,
		    col4 : 15
		});
		
		var callable = jasmine.dbConnection.prepareCall('CALL ' + testEnvironment.getTestModelName() + '()');
		callable.execute();
		var actualTableDataSet = tableDataSet.createFromResultSet(callable.getResultSet());
		callable.close();
		console.log("blah balh " + JSON.stringify(actualTableDataSet) + "blah blah");		
		expect(actualTableDataSet).toMatchData({
				sum_total:[12]
			},'sum_total');
	});
});