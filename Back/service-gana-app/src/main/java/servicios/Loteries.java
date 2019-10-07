package servicios;


import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.sql.*;
import java.util.ArrayList;

@Path("/loteries")
public class Loteries {
	
	ConnectionDB codb = new ConnectionDB();
	Connection conn = codb.initConnection();
	BufferedReader entrada = new BufferedReader(new InputStreamReader(System.in));

	
	@GET
    @Path("/getloteries")
    public ArrayList<JsonObject> getLoteries(@QueryParam("date") String date) throws SQLException
    {
		Statement stm = conn.createStatement();
		String query= "select * from Loterias where TRUNC(fechaCierre) = \'"+date+"\' AND estado = 'A'";
		ResultSet rs = stm.executeQuery(query);
		ArrayList<JsonObject> listObjects = new ArrayList<JsonObject>();
		
		while(rs.next()) {
			
			JsonObject response = new JsonObject();
			JsonObject objectResponse = new JsonObject();
			response.addProperty("idLotery", rs.getString("idLoterias"));
			response.addProperty("description",  rs.getString("descripcion"));
			response.addProperty("date", rs.getString("fechaCierre"));
			response.addProperty("image", rs.getString("imagen"));
			
			objectResponse.add("response", new Gson().toJsonTree(response));
			listObjects.add(objectResponse);
		}
		return listObjects;
    }
	
	@PUT
    @Path("/closelotery")
    public String closeLotery(@QueryParam("id") String id) throws SQLException
    {
		String varReturn = null;
		String query= "UPDATE Loterias SET estado = 'I' WHERE idLoterias ="+id;
		PreparedStatement stm = conn.prepareStatement(query);
		int count = stm.executeUpdate(query);		
		
		if(count > 0 ) {varReturn = id;} else {varReturn = "0";}
		
		return varReturn;
    }
	
	
	@GET
    @Path("/getnumberslotery")
    public ArrayList<JsonObject> getLoteryNumbers(@QueryParam("idLotery") String idLotery, @QueryParam("date") String date) throws SQLException
    {
		Statement stm = conn.createStatement();
		String query= "select nl.numero, nl.valorApuesta, "
				+ "nl.idLoterias, nl.estado, nl.idNumerosLoteria from numerosLoteria "
				+ "nl INNER JOIN NumerosGanadores l ON l.numeroGanadores = nl.numero "
				+ "AND l.fechaSorteo =\'"+date+"\' where nl.idLoterias ="+idLotery+" AND nl.estado = 'V'"; 
		ResultSet rs = stm.executeQuery(query);
		ArrayList<JsonObject> listObjects = new ArrayList<JsonObject>();
	
		while(rs.next()) {
			
			JsonObject objectResponse = new JsonObject();
			JsonObject response = new JsonObject();
			response.addProperty("idNumber", rs.getInt("idNumerosLoteria"));
			response.addProperty("number", rs.getInt("numero"));
			
			objectResponse.add("response", new Gson().toJsonTree(response));
			listObjects.add(objectResponse);
		}

		
		return listObjects;
    }
	
	
	@GET
    @Path("/winnersnumbers")
    public Response getWinnersNumbers(@QueryParam("date") String date, @QueryParam("number") String number) throws SQLException
    {
		Statement stm = conn.createStatement();
		String query= "select * from NumerosGanadores where TRUNC(fechaSorteo) = \'"+date+"\' AND numeroGanadores =" +number;
		ResultSet rs = stm.executeQuery(query);
		JsonObject response = new JsonObject();

		while(rs.next()) {
			
			response.addProperty("status", 200);
		}
		
		if(response.size() == 0) {response.addProperty("status", 400);}
		return Response.ok().entity(response).build();

    }
	
	@GET
    @Path("/winners")
    public ArrayList<JsonObject> getWinners(@QueryParam("number") String number) throws SQLException
    {
		CallableStatement cst = conn.prepareCall("{call getWinnerNumbers (?,?,?,?,?,?,?)}");
        
		cst.setString(1, number);
        cst.registerOutParameter(2, java.sql.Types.VARCHAR);
        cst.registerOutParameter(3, java.sql.Types.VARCHAR);
        cst.registerOutParameter(4, java.sql.Types.NUMERIC);
        cst.registerOutParameter(5, java.sql.Types.NUMERIC);
        cst.registerOutParameter(6, java.sql.Types.NUMERIC);
        cst.registerOutParameter(7, java.sql.Types.NUMERIC);
        
        ArrayList<JsonObject> listObjects = new ArrayList<JsonObject>();
        
        try {
        	cst.execute();
        	JsonObject response = new JsonObject();
			JsonObject objectResponse = new JsonObject();
			String name = cst.getString(2);
			String lastName = cst.getString(3);
			int idLotery = cst.getInt(4);
			int numberResult = cst.getInt(5);
			int price = cst.getInt(6);
			int idColilla = cst.getInt(7);
			
        	response.addProperty("name", name);
        	response.addProperty("lastName", lastName);
        	response.addProperty("idLotery", idLotery);
        	response.addProperty("numberResult", numberResult);
        	response.addProperty("price", price);
        	response.addProperty("idColilla", idColilla);
        	objectResponse.add("response", new Gson().toJsonTree(response));
			listObjects.add(objectResponse);
        }catch(Exception e) {
        	System.out.println(e);
        } 
		return listObjects;
    }
	
	@POST
    @Path("/createprize")
    public Response generatePrize(@QueryParam("dateBet") String dateBet, @QueryParam("idCol") String idCol, @QueryParam("prize") String prize, @QueryParam("totalPrice") String totalPrice ) throws SQLException
    {
		
		CallableStatement cst = conn.prepareCall("{call insertPrize (?,?,?,?)}"); 
		cst.setString(1, dateBet);
        cst.setString(2, idCol);
        cst.registerOutParameter(3, java.sql.Types.NUMERIC);
        cst.setString(4, totalPrice);
        JsonObject response = new JsonObject();
        
        try {
        	cst.execute();
        	response.addProperty("status", 200);
        }catch(Exception e) {
        	System.out.println(e);
        	
        }finally {
        	if(response.size() == 0) {response.addProperty("status", 400);}
        }
        
		return Response.ok().entity(response).build();
    }
	
	
	@GET
    @Path("/winnersdate")
    public ArrayList<JsonObject> getWinnersDate(@QueryParam("date") String date) throws SQLException
    {
		
		CallableStatement cst = conn.prepareCall("{call getPastWinners (?,?,?,?)}");
        cst.setString(1, date);
        cst.registerOutParameter(2, java.sql.Types.NUMERIC);
        cst.registerOutParameter(3, java.sql.Types.VARCHAR);
        cst.registerOutParameter(4, java.sql.Types.NUMERIC);
        ArrayList<JsonObject> listObjects = new ArrayList<JsonObject>();
        
        try {
        	boolean result = cst.execute();
        	
        	
        	while(true) {
        	    if (result) {
        	    	ResultSet rs = cst.getResultSet();
        	        System.out.println("Show results hre");
        	    } else {
        	        int updateCount = cst.getUpdateCount();
        	        if (updateCount == -1) {
        	            System.out.println("no more");
        	            break;
        	        }
        	        System.out.println("Results");
        	    }
        	    result = cst.getMoreResults();
        	}
        	
        	
        	
        	JsonObject response = new JsonObject();
			JsonObject objectResponse = new JsonObject();
			int numberWinner = cst.getInt(2);
			String imageLotery = cst.getString(3);
			int idWinnerNumber = cst.getInt(4);
        	response.addProperty("numberWinner", numberWinner);
        	response.addProperty("imageLotery", imageLotery);
        	response.addProperty("idWinnerNumber", idWinnerNumber);
        	objectResponse.add("response", new Gson().toJsonTree(response));
			listObjects.add(objectResponse);
        }catch(Exception e) {
        	System.out.println(e);
        } 
		return listObjects;
    }
}
