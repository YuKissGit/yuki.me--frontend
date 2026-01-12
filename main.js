//navbar------------------------------------------

//navbar---scroll effect-----
// document.addEventListener('scroll',()=>{
//   setTimeout(()=>{
//     changeHeader();
//   },150);
// });

// function changeHeader(){
//   const header = document.querySelector('header');
//     if(window.scrollY>20){
//     header.classList.add('scroll');
//   }else{
//     header.classList.remove('scroll');
//   }
// }


//navbar---click tab, change content of main
const tabs = document.querySelectorAll(".navbar-right-tab");
const contents = document.querySelectorAll(".main-content");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs
    tabs.forEach(t => t.classList.remove("active"));
    // Hide all contents
    contents.forEach(c => c.hidden = true);

    // Add active class to clicked tab
    tab.classList.add("active");
    // Show the corresponding content
    const target = tab.dataset.tab;
    document.getElementById(target).hidden = false;
    
  });
});

//sayhi tab--- snow--------------------------------
const btn = document.getElementById('sayhi-nav-snow-icon');
const snowArea = document.getElementById('sayhi');

let snowTimer = null;

btn.addEventListener('click', () => {
  if (snowTimer) return;//if snowing won't trigger again

  snowTimer = setInterval(() => {
    createSnow();
  }, 150); // one snowflake every 150ms //avoid multiple clicks

    setTimeout(() => {
    clearInterval(snowTimer);
    snowTimer = null;
  }, 30000);// one snowflake last

});

function createSnow() {
  const snow = document.createElement('div');
  snow.className = 'snow';

  snow.style.left = Math.random() * 80 + 'vw';// num for position
  snow.style.animationDuration = 10 + Math.random() * 10 + 's';//for speed

  const size = 4+Math.random()*11;//for generating random snow size
  //snow is square
  snow.style.width = size +'px';
  snow.style.height = size +'px';

  snowArea.appendChild(snow);

 //delete snow div after certain minutes,otherwise exist forever
  setTimeout(() => {
    snow.remove();
  }, 15000);//when delete the snow flower div
}


// blog-----auto fetch from blogs.json-----------------
const container = document.querySelector('.tab-content-blogs'); 

fetch('./data/blogs.json')
  .then(res => res.json())
  .then(posts => {
    posts.forEach(post => {
      const blogDiv = document.createElement('div');
      blogDiv.className = 'blogs-blog';

      //according to the data from blogs.json, generate static HTML code
      //1
      let html = `<div class="blogs-blog-title">${post.title}</div>
                  <div class="blogs-blog-date">${post.date}</div>`;

      //2. class="blog-content-wrapper" to add wrap effect when click
      html += `<div class="blog-content-wrapper">`;

      post.content.forEach(item => {
        if (typeof item === "string") html += `<div class="blogs-blog-article">${item}</div>`;
        else switch(item.type) {
          case "list":
            html += "<ul>";
            item.items.forEach(li => html += `<li>${li}</li>`);
            html += "</ul>";
            break;
          case "heading":
            html += `<h${item.level}>${item.text}</h${item.level}>`;
            break;
          case "image":
            html += `<img src="${item.src}" alt="${item.alt}" style="max-width:100%"/>`;
            break;
          case "code": 
             html += `<pre><code>${item.content}</code></pre>`;
             break;
          case "hr":
             html += `<hr/>`;
             break;
          case "link":
             html += `<a href="${item.href}">${item.text}</a>`;
             break;
        }
      });

      // 3 close div
      html += `</div>`; 

      //add static html code to div 
      blogDiv.innerHTML = html;

      //add expanded class to toggle wrapper or not when click
      blogDiv.addEventListener('click', () => {
        // find content-wrapper area
        const contentWrapper = blogDiv.querySelector('.blog-content-wrapper');
        //toggle 'expanded' status
        contentWrapper.classList.toggle('expanded');
      });

      container.appendChild(blogDiv);
    });
  })
  .catch(err => console.error("Error loading blogs:", err));


  //load projects-----------------------
  //1. select parent area
  const pContainer = document.querySelector('.main-right-projects');
  //2-1. fetch data
  fetch('./data/projects.json') //return a promise
    .then(r=>r.json()) //parse JS data
    .then(projects =>{// projects is the array of json file
      projects.forEach(project =>{ //p is an obj of the array
        const projectDiv = document.createElement('div');
        projectDiv.className = 'project';

        let html = `
          <a href="${project.website}" class="project-left-images"><img class="project-left-image" src=${project.image} width="500px" height="281px" alt="project image"></a>
            <div class="project-left-text">
              <div class="text-title">${project.title}</div>
                  
              <div class="text-icons">
                <div class="text-icons-labels">
        `;

        project.labels.forEach(item => {
          html+= `<div class="text-icons-label">${item}</div>`;
        })

        html+=`
                </div>
              <div class="text-icons-links">
                  <a href="${project.github}"><svg class="sidebar-link-icon" width=30 height=30 viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>github [#142]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399" id="github-[#142]"> </path> </g> </g> </g> </g></svg> </a>
                  <a href="${project.youtube}"><svg class="sidebar-link-icon" width=30 height=30 viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M9.49614 7.13176C9.18664 6.9549 8.80639 6.95617 8.49807 7.13509C8.18976 7.31401 8 7.64353 8 8V16C8 16.3565 8.18976 16.686 8.49807 16.8649C8.80639 17.0438 9.18664 17.0451 9.49614 16.8682L16.4961 12.8682C16.8077 12.6902 17 12.3589 17 12C17 11.6411 16.8077 11.3098 16.4961 11.1318L9.49614 7.13176ZM13.9844 12L10 14.2768V9.72318L13.9844 12Z" ></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M0 12C0 8.25027 0 6.3754 0.954915 5.06107C1.26331 4.6366 1.6366 4.26331 2.06107 3.95491C3.3754 3 5.25027 3 9 3H15C18.7497 3 20.6246 3 21.9389 3.95491C22.3634 4.26331 22.7367 4.6366 23.0451 5.06107C24 6.3754 24 8.25027 24 12C24 15.7497 24 17.6246 23.0451 18.9389C22.7367 19.3634 22.3634 19.7367 21.9389 20.0451C20.6246 21 18.7497 21 15 21H9C5.25027 21 3.3754 21 2.06107 20.0451C1.6366 19.7367 1.26331 19.3634 0.954915 18.9389C0 17.6246 0 15.7497 0 12ZM9 5H15C16.9194 5 18.1983 5.00275 19.1673 5.10773C20.0989 5.20866 20.504 5.38448 20.7634 5.57295C21.018 5.75799 21.242 5.98196 21.4271 6.23664C21.6155 6.49605 21.7913 6.90113 21.8923 7.83269C21.9973 8.80167 22 10.0806 22 12C22 13.9194 21.9973 15.1983 21.8923 16.1673C21.7913 17.0989 21.6155 17.504 21.4271 17.7634C21.242 18.018 21.018 18.242 20.7634 18.4271C20.504 18.6155 20.0989 18.7913 19.1673 18.8923C18.1983 18.9973 16.9194 19 15 19H9C7.08058 19 5.80167 18.9973 4.83269 18.8923C3.90113 18.7913 3.49605 18.6155 3.23664 18.4271C2.98196 18.242 2.75799 18.018 2.57295 17.7634C2.38448 17.504 2.20866 17.0989 2.10773 16.1673C2.00275 15.1983 2 13.9194 2 12C2 10.0806 2.00275 8.80167 2.10773 7.83269C2.20866 6.90113 2.38448 6.49605 2.57295 6.23664C2.75799 5.98196 2.98196 5.75799 3.23664 5.57295C3.49605 5.38448 3.90113 5.20866 4.83269 5.10773C5.80167 5.00275 7.08058 5 9 5Z" ></path> </g></svg> </a>
              </div>  

              </div>
            </div>
          </div>
        `;

        //2-2. generate static html code
        projectDiv.innerHTML = html;
        //2-3. add html div to parent 
        pContainer.appendChild(projectDiv);
      });

    });



// //load comments--------------------------------------
// const form = document.querySelector('#sayhi-nav-comment');
// const commentsDiv = document.querySelector('#sayhi-comments');

// // 提交评论
// form.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const data = {
//     name: form.name.value,
//     email: form.email.value,
//     content: form.content.value,
//     website: form.website.value
//   };

// const res = await fetch('http://127.0.0.1:3000/comments', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify(data)
// });
// const result = await res.json();

// if(result.success){
//   form.reset();
//   loadComments();  // ✅ 只在成功后刷新
// } else {
//   alert('提交失败');
// }

// });

// async function loadComments() {
//   const res = await fetch('http://127.0.0.1:3000/comments');
//   const comments = await res.json();
//   console.log(comments); // ✅ 查看返回内容

//   commentsDiv.innerHTML = comments.map(c => `
//     <div class="comment">
//       <strong>${c.name}</strong> (${new Date(c.createdAt).toLocaleString()}):
//       <p>${c.content}</p>
//     </div>
//   `).join('');
// }


// // 页面初始加载
// loadComments();


// //----------------
// const commentForm = document.getElementById('sayhi-nav-comment');
// const textarea = commentForm.querySelector('.comment-box');

// textarea.addEventListener('focus', () => {
//   commentForm.classList.add('is-active');
// });

// document.addEventListener('click', (e) => {
//   if (!commentForm.contains(e.target)) {
//     commentForm.classList.remove('is-active');
//   }
// });

// commentForm.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   const submitBtn = commentForm.querySelector('.comment-submit');
//   submitBtn.disabled = true;
//   submitBtn.textContent = 'Sending...';

//   const formData = new FormData(commentForm);
//   const data = Object.fromEntries(formData.entries());

//   // 🚫 检查 honeypot
//   if (data.website) {
//     alert('Spam detected.');
//     submitBtn.disabled = false;
//     submitBtn.textContent = 'comment';
//     return;
//   }

//   try {
//     const res = await fetch('http://localhost:5500/comments', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         name: data.name,
//         email: data.email,
//         content: data.content
//       })
//     });
//     console.log(res.status, await res.text());
//     if (!res.ok) throw new Error('Request failed');

//     alert('Comment sent successfully!');

//     // ✅ 只清空评论内容，不清空 name/email
//     textarea.value = '';

//     // 收起评论框
//     commentForm.classList.remove('is-active');
//     textarea.blur();

//   } catch (err) {
//     alert('Failed to send comment. Please try again.');
//     console.error(err);
//   } finally {
//     submitBtn.disabled = false;
//     submitBtn.textContent = 'comment';
//   }
// });
const commentForm = document.getElementById('sayhi-nav-comment');
const textarea = commentForm.querySelector('.comment-box');
const commentsDiv = document.getElementById('sayhi-comments');

// focus 效果
textarea.addEventListener('focus', () => {
  commentForm.classList.add('is-active');
});

document.addEventListener('click', (e) => {
  if (!commentForm.contains(e.target)) {
    commentForm.classList.remove('is-active');
  }
});

// 提交评论
commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = commentForm.querySelector('.comment-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  const formData = new FormData(commentForm);
  const data = Object.fromEntries(formData.entries());

  // honeypot 检查
  if (data.website) {
    alert('Spam detected.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'comment';
    return;
  }

  try {
    // ⚠️ 注意这里填你后端真实 URL
    const res = await fetch('http://127.0.0.1:3000/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        content: data.content
      })
    });

    if (!res.ok) throw new Error('Request failed');

    // 成功
    textarea.value = ''; // 只清空评论
    // alert('Comment sent successfully!');

    // 刷新评论区
    await loadComments();

    // 收起评论框
    commentForm.classList.remove('is-active');
    textarea.blur();

  } catch (err) {
    alert('Failed to send comment. Please try again.');
    console.error(err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'comment';
  }
});

// 加载评论列表
async function loadComments() {
  try {
    const res = await fetch('http://127.0.0.1:3000/comments');
    if(!res.ok) throw new Error('Failed to load comments');
    const comments = await res.json();

    commentsDiv.innerHTML = comments.map(c => `
      <div class="comment">
        <strong>${c.name}</strong> (${new Date(c.createdAt).toLocaleString()}):
        <p>${c.content}</p>
      </div>
    `).join('');
  } catch(err) {
    console.error(err);
    commentsDiv.innerHTML = '<p>Failed to load comments.</p>';
  }
}

// 页面初始加载
loadComments();




