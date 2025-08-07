declare global{
    namespace Express {
        interface Request {
            session: any;
            currentUser: any;
        }
    }
}

import app from "./app";

let startServer = async () =>{

    let port = 3000;
    app.listen(port, ()=>{
        console.log('App started', port);
    });
}

startServer()
.then(()=>{
})
.catch((err)=>{
})