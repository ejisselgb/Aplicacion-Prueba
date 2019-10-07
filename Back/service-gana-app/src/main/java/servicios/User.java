package servicios;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

import com.google.gson.JsonObject;


import java.sql.*;

@Path("/users")
public class User {
	
	ConnectionDB codb = new ConnectionDB();
	Connection conn = codb.initConnection();
	
	@POST
	@Path("/login")
	public Response login(@QueryParam("nombreUsuario") String nombreUsuario, @QueryParam("clave") String clave) throws SQLException {   
	    
		
		Statement stm = conn.createStatement();
		String query = "select * from AdministradoresSys where nombreUsuario = \'"+nombreUsuario+"\' AND clave=\'"+clave+"\'"; 	
		ResultSet rs = stm.executeQuery(query);
		JsonObject response = new JsonObject();
		
		while(rs.next()) {
			response.addProperty("status", 200);
		}
		
		if(response.size() == 0) {response.addProperty("status", 400);}
		//return Response.ok().entity(response).build();
		
		return Response.ok()
	               .entity(response)
	               .header("Access-Control-Allow-Origin", "*")
	               .build();
	 }

	
	@GET
    @Path("/getuser")
    public Response getAllUsers() throws SQLException
    {
		Statement stm = conn.createStatement();
		ResultSet rs = stm.executeQuery("select * from AdministradoresSys");
		String result = null;
		while(rs.next()) {
			System.out.println("Respuesta "+ rs);
			result = rs.getString("nombreUsuario");
			result = rs.getString("clave");
		}
		
        return Response.status(200).entity(result).build();
    }

}
