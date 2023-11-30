function showPassword(e){
  var input = document.getElementById('password')
  if(input.type === 'password'){
    input.type = "text"
    e.target.className = "fas fa-eye"
  }else{
    input.type = "password"
    e.target.className = "fas fa-eye-slash"
  }
}