class Router {
   activehash = ''
 
 

 

  handleRouteChange(f) {
   window.addEventListener("hashchange", (e)=>{
    console.log(e)
    
   })



   
  }
}

export  default  new Router();
