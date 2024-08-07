class Router {
   activehash = ''
 
 

 

  handleRouteChange(f) {
   window.addEventListener("hashchange", (e)=>{
   f()
   })



   
  }
}

export  default  new Router();
