import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}


const connection: ConnectionObject = {}

const connectDbs = async (): Promise<void> =>{

    
    if(connection.isConnected){
        console.log("Already connected to database")
        return
    }

    try {
     
       const connect =   await mongoose.connect(process.env.DATABASE_URL || "" );
          
       connection.isConnected = connect.connections[0].readyState
       console.log("DB connection successful")

        
        
    } catch (error) {
        console.log("Database connection failed", error)
        process.exit(1)
    }
}

export default connectDbs;