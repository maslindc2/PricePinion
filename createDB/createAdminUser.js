db = db.getSiblingDB('admin');
db.createUser({
	user: "admin", 
	pwd: "pricepinion",
	roles: [ "readWriteAnyDatabase", "dbAdminAnyDatabase", "clusterAdmin"]	
});