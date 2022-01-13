// Navbar Js
let menuOpenBtn=document.querySelector(".menu-icon .open")
let menuCloseBtn=document.querySelector(".menu-icon .close")
let signBoxs=document.querySelectorAll(".sign")
let signInBtn=document.querySelector(".sign-in")
let signUpBtn=document.querySelector(".sign-up")
let usernameBoxs=document.querySelectorAll(".username")
let comments=[]
let commentId;
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
menuOpenBtn.addEventListener("click", function (){
    document.querySelectorAll(".inside").forEach(link=>link.children[1].style.display="none")
    navMenu(menuCloseBtn,menuOpenBtn,"230px")
})
menuCloseBtn.addEventListener("click", function (){
    navMenu(menuOpenBtn,menuCloseBtn,"0px")
})
if (checkUser()===true) {
  signBoxs.forEach(item=>item.style.display="none")
  usernameBoxs.forEach(item=>item.style.display="block")
  document.querySelectorAll(".username span").forEach(item=>item.innerText=getUserName())
  document.querySelectorAll(".logout").forEach(item=>{
    item.addEventListener("click",()=>{
      localStorage.removeItem("user"); localStorage.removeItem("userInfo")
      mainPage()
      setTimeout(() => {
        signBoxs.forEach(item=>item.style.display="flex")
        usernameBoxs.forEach(item=>item.style.display="none")
      }, 1000);
    })
  })
}
$(window).on('load', function () {
  $(".loader").delay(500).fadeOut("slow");
  $("#overlayer").delay(600).fadeOut("slow");
});
$(document).ready(function(){
    $(".alll").click(function(){
        $(".open-nav-links").not($(this).next()).slideUp()
        $(".menu-holder").height("400px")
        $(this).next().slideToggle("slow");
    });
    $(".open-nav-links li.in a").on('click', function(event) {
        if (this.hash !== "") {
          event.preventDefault();
          $('html, body').animate({
            scrollTop: $(this.hash).offset().top-1000
          }, 500, function(){
          });
      } 
  });
  $("#questions .title").click(function(){
    $(".inner").not($(this).next()).slideUp()
    $(this).next().slideToggle();
});
});
switch (checkPage()) {
  case "login.html":
    let userNameLogin=document.querySelector("#existUsername")
    let passWordLogin=document.querySelector("#existPassword")
    let loginBtn=document.querySelector(".login-btn")
    let wantBeRegisterBtn=document.querySelector(".register")
    let incorrectAlert=document.querySelector(".alert-incorrect-login")
    loginBtn.addEventListener("click",()=>{
      let user=JSON.parse(localStorage.getItem("users"))?.find(user=>user.userName===userNameLogin.value)
      if (user && user.password===passWordLogin.value) {
          localStorage.setItem("user","true")
          localStorage.setItem("userInfo", userNameLogin.value)
          mainPage()
      }
      else(
         errorAlert(incorrectAlert)
      )
    })
    wantBeRegisterBtn.addEventListener("click", ()=>{registerPage()})
    break;
  case "register.html":
      let newUserFirstName=document.querySelector("#name")
      let newUserLastName=document.querySelector("#lastName")
      let newUserName=document.querySelector("#username")
      let newUserPass=document.querySelector("#password")
      let registerBtn=document.querySelector(".register-btn")
      let emptyInputAlert=document.querySelector(".alert-empty-input")
      let existUsernameAlert=document.querySelector(".alert-exist-username")
      let form=document.querySelector("form")
      let successRegisterAlert=document.querySelector("#register .alert-success")
      registerBtn.addEventListener("click",function(){
        if (JSON.parse(localStorage.getItem("users"))===null) {
            localStorage.setItem("users",JSON.stringify([]))
        }
        let users=JSON.parse(localStorage.getItem("users"))
        if (checkForm(document.querySelectorAll("#register form input"))===false) {
            errorAlert(emptyInputAlert)
        }
        else if (users.filter(user=>user.userName===newUserName.value).length>0) {
            errorAlert(existUsernameAlert)
        }
        else{
            createUser(newUserFirstName,newUserLastName,newUserName,newUserPass,users)
            successRegisterAlert.classList.remove("invisible")
            setTimeout(() => {
            loginPage()
            }, 1500);
        }
        form.reset()
      })
      break;
  case "blog.html":
    document.querySelector(".single-blog").addEventListener("click",()=>{location.href=("./single-blog.html")})
    break;
  case "cloud.html":
    popupFunc()
    break;
  case "single-blog.html":
    popupFunc()
    let postCommentBtn=document.querySelector(".comment-btn")
    let submitReplyCommentBtn=document.querySelector(".comment-btn-reply")
    let commentContent=document.querySelector("#comment")
    let comments=document.querySelector(".comments")
    localStorage.getItem("comments")===null ? "" : JSON.parse(localStorage.getItem("comments")).forEach(item=>{
      postComment(comments,item.id,item.username,item.date,item.comment,"base")
      item.innerHTML+=document.createElement("span")
      item.replies==""?"": item.replies.forEach(reply =>{
      postComment(document.querySelector(`[data-id="${item.id}"]`),reply.id,reply.username,reply.date,reply.comment,"reply")
    })
    })
    // add comment js
    postCommentBtn.addEventListener("click",function(){
      if (checkUser()) {
        if (commentContent.value!=="") {
        commentId=Number(comments.lastElementChild.getAttribute("data-id"))+1;
        localStorage.getItem("comments")===null ? localStorage.setItem("comments",JSON.stringify(comments)) : ""
        saveCommentLocal(createCommentObj(getUserName(),commentContent,commentId))
        postComment(comments,commentId,getUserName(),getPostDate(),commentContent.value,"base")
        preventDefaults()
        formReset(commentContent)
        }
      }
      else{
      document.querySelector(".add-comment .alert").style.display="inline"       
      }
    })
    // reply js
    preventDefaults()
    $(".reply-btn").on('click', function(event) {
        let id=this.getAttribute("data-id")
        changeBtn(postCommentBtn,submitReplyCommentBtn,"block")
        $(".comment-btn-reply").attr("data-id",id)
    })
    submitReplyCommentBtn.addEventListener("click",function(){
      if (checkUser()) {
        if (commentContent.value!=="") {
          let id=this.getAttribute("data-id")
          let relatedComment=Array.from(document.querySelectorAll(".comment-card.base")).find(item=>item.getAttribute("data-id")===id)
          postComment(relatedComment,id,getUserName(),getPostDate(), commentContent.value,"reply")
          let commentsLocal=Array.from(JSON.parse(localStorage.getItem("comments")))
          commentsLocal.forEach(item=>{
            if (item.id==id) {
              item.replies.push(createCommentObj(getUserName(),commentContent,id))
            }
          })
          localStorage.setItem("comments", JSON.stringify(commentsLocal))
          formReset(commentContent)
         changeBtn(submitReplyCommentBtn,postCommentBtn,"block")
        }
      }
      else{
      document.querySelector(".add-comment .alert").style.display="inline"       
      }
    })
    break;
    case "index.html":
      let navSection=document.querySelector("#nav")
      navSection.style.backgroundColor="transparent"
      document.addEventListener("scroll",function(){
        if (window.scrollY>60) {
          navSection.classList.add("nav-scroll")
          document.querySelector("#nav .nav-bar").style.height="80px"
         }
         else{
           navSection.classList.remove("nav-scroll")
           document.querySelector("#nav .nav-bar").style.height="90px"
         }
        if (window.scrollY>110) {
          let delay=1
          document.querySelectorAll(".service-card").forEach(item=>{
            item.classList.add("animate__fadeInUp",`animate__delays-${delay}s`)
            item.style.visibility="visible"
            delay+=1
          })
        }
        if (window.scrollY>700) {
          document.querySelector(".right-img-box").classList.add("animate__fadeInLeft")
          document.querySelector(".right-img-box").style.visibility="visible"
        }
        if (window.scrollY>1350) {
          document.querySelector(".left-img-box").classList.add("animate__fadeInLeft")
          document.querySelector(".left-img-box").style.visibility="visible"
        }
        if (window.scrollY>3200) {
          let delay=1
          document.querySelectorAll(".price-card").forEach(item=>{
            item.classList.add("animate__fadeInUp",`animate__delays-${delay}s`)
            item.style.visibility="visible"
            delay+=1
          })
        }
      })
      $(".select-btn").on("click",function(){
        $(".plan-name").css("background","white").find(".name").css("color","#3B566E")
        $(this).parent().find(".plan-name").css("background-color",'#585CE9').find(".name").css("color","#fff")
      })
    break;
      default:
    break;
}
function preventDefaults() {
  $(".reply-btn").on('click', function(event) {
    event.preventDefault();
    $("#comment").focus()
})
}
function changeBtn(none,block,displaystyle) {
  none.style.display="none"
  block.style.display=displaystyle
}
function getUserName() {
  return localStorage.getItem("userInfo")
}
function getPostDate() {
  let date=new Date()
  let postDate={
    day:date.getDate(),
    month:monthNames[date.getMonth()],
    year:date.getFullYear()
  }
  return postDate
}
function createCommentObj(username, text,id) {
  let commentInfo={
    username: username,
    comment:text.value,
    date: getPostDate(),
    id:id,
    replies: []
  }
  return commentInfo
}
function saveCommentLocal(comment) {
  let currentComments=Array.from(JSON.parse(localStorage.getItem("comments")))
  currentComments.push(comment)
  localStorage.setItem("comments",JSON.stringify(currentComments))
}



let loginPage=()=>{location.href = "./login.html";}
let registerPage=()=>{ location.href = "./register.html";}
let mainPage=()=>{location.href = "./index.html";}
function postComment(item,commentId,username, postDate,text,reply) {
  switch (reply) {
    case "base":
      item.innerHTML+=`  <div class="comment-card ${reply}" data-id=${commentId}>
      <div class="base-comment-holder  d-flex">
          <div class="col-1 user-image">
              <img src="./assets/images/comment-avatar.png" alt="user-image" class="w-100">
          </div>
          <div class="inside col-11">
              <div class="up-box d-flex w-100 justify-content-between">
                 <div class="info">
                 <p class="username m-0">${username}</p>
                 <p class="time">${postDate.day}  ${postDate.month} ${postDate.year}</p>
                 </div>
                 <a href="#" class="reply-btn" data-id=${commentId}><i class="fas fa-reply me-1"></i>Reply</a>
              </div>
              <p class="comment-text">${text}</p>
          </div>
         </div>
    </div>`
      break;
  case "reply":
    item.innerHTML+=`  <div class="comment-card ${reply}" data-id=${commentId}>
    <div class="base-comment-holder  d-flex">
        <div class="col-1 user-image">
            <img src="./assets/images/comment-avatar.png" alt="user-image" class="w-100">
        </div>
        <div class="inside col-11">
            <div class="up-box d-flex w-100 justify-content-between">
               <div class="info">
               <p class="username m-0">${username}</p>
               <p class="time">${postDate.day}  ${postDate.month} ${postDate.year}</p>
               </div>
            </div>
            <p class="comment-text">${text}</p>
        </div>
       </div>
  </div>`
    default:
      break;
  }
}
function navMenu(btn1,btn2,height) {
    document.querySelector(".menu-holder").style.height=height
    btn1.style.display="block"
    btn2.style.display="none"
}
function menuInsideOpen(insideDiv,display,height) {
    document.querySelector(".menu-holder").style.height=height
    insideDiv.style.display=display
}

function errorAlert(span) {
  span.style.opacity="1"
  setTimeout(()=>{
      span.style.opacity="0"
  },5000)
}
function checkForm(inputs) {
  for (const input of inputs) {
      if (input.value!=="") {
          continue
        }
        return false
  }
}
function createUser(name,surname,username,password,usersArr) {
  let newUser={
      firstName: name.value,
      lastName: surname.value,
      userName: username.value,
      password: password.value
  }
  usersArr.push(newUser)
  localStorage.setItem("users",JSON.stringify(usersArr))
}
function formReset(input) {
    input.value=""
}
function checkUser() {
 if (localStorage.getItem("user")==="true") {
   return true
 }
 else{
   return false
 }
}
function checkPage() {
  let path = window. location. pathname;
  let page = path. split("/"). pop();
  return page
}
// popup funcs
function popupFunc() {
  let images=document.querySelectorAll(".gallery .img-box")
  let popup=document.querySelector("#popup")
  let closeBtn=document.querySelector(".close-icon")
  let nextBtn=document.querySelector(".next")
  let previousBtn=document.querySelector(".previous")
  images.forEach((image)=>{
    image.addEventListener("click", (a)=>{
    a.preventDefault();
    popup.style.display="flex"
    changeImg(image)
    image.classList.add("active-img");
    })
  })
  closeBtn.addEventListener("click", ()=>{
    galleryClose()
  })
  popup.addEventListener("click", (e) => {
    if (e.target.id==="popup") {
      galleryClose()
  }
  nextBtn.addEventListener("click",()=>{
    nextImage(document.querySelector(".active-img"))
    })
    
    previousBtn.addEventListener("click",()=>{
    previousImage(document.querySelector(".active-img"))
    })
});

}
function galleryClose() {
  popup.style.display="none"
}
function nextImage(image) {
  // let nextElement=image.nextElementSibling
  if (image.nextElementSibling!==null) {
    image.nextElementSibling.classList.add("active-img")
      changeImg(image.nextElementSibling)
  }
  else{
      image.parentElement.children[0].classList.add("active-img")
      changeImg(image.parentElement.children[0])
  }
  image.classList.remove("active-img")
}

function previousImage(image) {
  let previousElement=image.previousElementSibling
  let parentLenght=image.parentElement.children.length
  if (previousElement!==null) {
      previousElement.classList.add("active-img")
      changeImg(previousElement)
  }
  else{
      image.parentElement.children[parentLenght-1].classList.add("active-img")
      changeImg(image.parentElement.children[parentLenght-1])
  }
  image.classList.remove("active-img")
}
function changeImg(image) {
  let largeImg=document.querySelector("#popup .img-box img")
  largeImg.setAttribute("src", image.getAttribute("href"))
}

// function animateValue(id, start, end, duration) {
//   if (start === end) return;
//   let range = end - start;
//   let current = start;
//   let increment = end > start? 1 : -1;
//   let stepTime = Math.abs(Math.floor(duration / range));
//   let obj = document.getElementById(id);
//   let timer = setInterval(function() {
//       current += increment;
//       obj.innerHTML = current;
//       if (current == end) {
//           clearInterval(timer);
//       }
//   }, stepTime);
// }

