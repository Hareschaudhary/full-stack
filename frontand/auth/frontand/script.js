const API_URL ='http://localhost:3000/api/users'

const RegisterForm = document.getElementById('registerform')
const LoginrForm = document.getElementById('loginform')

if(RegisterForm){
RegisterForm.addEventListener('submit',async function(e){
e.preventDefault()
const username = document.getElementById('registerusername').value
const email = document.getElementById('registeremail').value
const password = document.getElementById('registerpassword').value

console.log(username,password,email)


    const res = await fetch(
        `${API_URL}/register`,
        {
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({username,email,password})
        })
        const data =await res.json()

        if(res.ok){
            alert("Registraction succefully you can now login")
            window.location.href = "index.html"
        }else{
            alert(data.message || "Registraction Fail")
        }

})
}

if(LoginrForm){
    LoginrForm.addEventListener('submit',async function(e){
e.preventDefault()

const email = document.getElementById('loginemail').value
const password = document.getElementById('loginpassword').value


    const res = await fetch(
        `${API_URL}/login`,
        {
            method:'POST',
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({email,password})
        })
        const data =await res.json()
         console.log(data)
        if(res.ok){
            localStorage.setItem("token",data.token)
            window.location.href = "student.html"
        }else{
            alert(data.message || "Login Fail")
        }
})
}