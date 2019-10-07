package servicios;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.sql.*;  
import java.util.Properties;

public class ConnectionDB {
	
	public ConnectionDB() {}
	
	public Connection initConnection() {
		
		try(InputStream output = new FileInputStream("C:\\Users\\pc\\eclipse-workspace\\service-gana-app\\src\\main\\java\\config\\Config.properties")) {
			
			Properties prop = new Properties();
            prop.load(output);
            
			Class.forName(prop.getProperty("jdbcDrive"));
			Connection con=DriverManager.getConnection(prop.getProperty("host"),prop.getProperty("name"),prop.getProperty("pass"));
			//Statement stmt=con.createStatement();
			
			return con;
		}
		catch (Exception e){ System.out.println(e);}
		
		return null;
	}

}
