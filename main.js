
//===================navbar---click tab, change tab content of main==========
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


//=======================sayhi tab--- snow============================
const snowBtn = document.getElementById('sayhi-nav-snow-icon');
const snowArea = document.getElementById('sayhi');
const snowNumDisplay = document.querySelector('.sayhi-nav-snow-num');

let snowTimer = null;
let isCoolingDown = false;

//1. get current num from DB
fetch('https://yuki-me-backend.onrender.com/api/snow-clicks')
//fetch('http://127.0.0.1:3000/api/snow-clicks')
  .then(r => r.json())
  .then(data => {
    if (snowNumDisplay) {
      snowNumDisplay.textContent = data.count;
    }
  })
  .catch(err => console.error("failed load snow num ", err));

// 2. configure tb event
snowBtn.addEventListener('click', () => {
  if (isCoolingDown) {
    console.log("snow btn cooling down...");
    return; 
  }

  // 2. set status, change btn style
  isCoolingDown = true;

  snowBtn.style.opacity = '0.5';
  snowBtn.style.cursor = 'not-allowed';

  // 3. send num to backend
  let currentVal = parseInt(snowNumDisplay.textContent, 10) || 0;//10 for decimal
  snowNumDisplay.textContent = currentVal + 1;

  sendClicksToServer(1);

  // 4. start snow
  if (!snowTimer) {//if snowing won't trigger again
    snowTimer = setInterval(() => {
      createSnow();
    }, 150); // one snowflake every 150ms //avoid multiple clicks

    setTimeout(() => {
      clearInterval(snowTimer);
      snowTimer = null;
    }, 10000);// one snowflake last
  }

  // 6. unlock btn
  setTimeout(() => {
    isCoolingDown = false;
    snowBtn.style.opacity = '1';
    snowBtn.style.cursor = 'pointer';
    
  }, 5000); //time to unlock btn
});

// ==================blog-----auto fetch from blogs.json=====================
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


  //=====================projects tab------load projects==================
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

//=======================sayhi tab================================

const commentForm = document.getElementById('sayhi-nav-comment');
const rootCommentBox = commentForm.querySelector('.comment-box');
const commentsArea = document.getElementById('sayhi-comments');
let activeReplyForm = null; 

//static root comment box--configure------------------
  //root comment-focus effect
rootCommentBox.addEventListener('focus', () => {
  commentForm.classList.add('is-active');
});

document.addEventListener('click', (e) => {
  if (!commentForm.contains(e.target)) { 
    commentForm.classList.remove('is-active');
  }
});

  //root comment-submit
commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = commentForm.querySelector('.comment-submit');
  
  // Debounce - Prevent duplicate submission
  if(submitBtn.disabled) return;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  const formData = new FormData(commentForm);
  const data = Object.fromEntries(formData.entries());

  // Honeypot validation
  if (data.website) {
    alert('Spam detected.');
    resetBtn(submitBtn, 'Comment');
    return;
  }

  try {
    const res = await fetch('https://yuki-me-backend.onrender.com/comments', { 
    // const res = await fetch('http://127.0.0.1:3000/comments', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        content: data.content,
        parentId: null //root comment has no parentId
      })
    });

    if (!res.ok) throw new Error('Comment request failed');

    rootCommentBox.value = ''; 
    commentForm.classList.remove('is-active');
    // textarea.blur();//Removes keyboard focus from the input field
    await loadComments();

  } catch (err) {//catch this Error('Comment request failed');
    alert('Failed to send comment.'); 
    console.error(err);
  } finally {
    resetBtn(submitBtn, 'Comment');
  }
});

//commentsArea-----------------------------------
commentsArea.addEventListener('click', e => {//keep only one reply box open, so listen whole comments area
    
  // "Show more replies" click event--------------
  if (e.target.closest('.replies-showmore')) {
    const btn = e.target.closest('.replies-showmore');

    //in commentsArea there are multiple comments and show more, find the toggle-replies of current show more btn
    const toggleWrapper = btn.closest('.toggle-replies');

    //find hidden div at same level
    const hiddenDiv = toggleWrapper.previousElementSibling;

    if (!hiddenDiv || !hiddenDiv.classList.contains('hidden-replies-container')) {
      return;
    }

    const isHidden = hiddenDiv.style.display === 'none';

    hiddenDiv.style.display = isHidden ? 'block' : 'none';
    btn.textContent = isHidden ? '- Hide replies -' : '- Show more replies -';
  }

  //reply event----------------------------------
  const replyBtn = e.target.closest('.generate-comment-reply');
  if (replyBtn) {
    const parentId = replyBtn.dataset.id;
    const parentName = replyBtn.dataset.name;

    // 1. remove exist modal (Keyboard Navigation) //keep only one reply form open
    const existingOverlay = document.querySelector('.reply-modal-overlay');
    if (existingOverlay) existingOverlay.remove();

    // 2. create HTML
    const replyHtml = `
      <div class="reply-modal-overlay"> 
        <div class="reply-modal-content">

          <div class="reply-modal-title">Replying to @${parentName}</div>

          <form class="reply-form">
            <textarea class="comment-box" name="content" placeholder="Post reply ..." required></textarea>
            <div class="comment-button-required">
              *<input class="comment-button-required-input" type="text" name="name" placeholder="Your name" required>
              *<input class="comment-button-required-input" type="email" name="email" placeholder="Your email" required>
            </div>

            <div class="reply-form-buttons">
              <button class="reply-form-buttons-cancel comment-submit" type="button">Cancel</button>
              <button class="reply-form-buttons-submit comment-submit" type="submit">Reply</button>
            </div>
          </form>

        </div>
      </div>
    `;

    // 3. insert to target area
    document.body.insertAdjacentHTML('beforeend', replyHtml);
    
    
    // 4. get cancel button and configure event
    const overlay = document.body.lastElementChild;
    const form = overlay.querySelector('.reply-form');

    const cancelBtn = overlay.querySelector('.reply-form-buttons-cancel');
    cancelBtn.addEventListener('click', () => {
        overlay.remove(); 
        activeReplyForm = null;
    });

    // 5. click other area, close modal
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.remove();
        activeReplyForm = null;
      }
    });

    // 6. submit event
    activeReplyForm = form;
    handleReplySubmit(form, parentId, parentName);//pass parentName to merge to reply content
  }

});

//Paginated Comment Loading--------------------------
//default to 1
let currentPage = 1;
let totalPages = 1;

const pageNewerBtn = document.querySelector('.page-newer');
const pageOlderBtn = document.querySelector('.page-older');
const currentPageSpan = document.querySelector('.page-pagination-current-page');
const totalPageSpan = document.querySelector('.page-pagination-all-page');

async function loadComments(page = 1) {
  try {
    activeReplyForm = null; //reset reply form state

    //limit 15 comments(root) per page
    const res = await fetch(`https://yuki-me-backend.onrender.com/comments?page=${page}&limit=15`);
    //const res = await fetch(`http://127.0.0.1:3000/comments?page=${page}&limit=15`);

    if (!res.ok) throw new Error('Failed to load comments');
    
    // { comments: [], totalPages: 10 }
    const data = await res.json(); 

    const commentsList = data.comments; //Array.isArray(data) ? data : data.comments;
    const serverTotalPages = data.totalPages || 1; 
    commentsArea.innerHTML = renderComments(commentsList);

    currentPage = page;
    totalPages = serverTotalPages;
    
    updatePaginationUI();

  } catch (err) {
    console.error(err);
    commentsArea.innerHTML = '<p>Failed to load comments.</p>';
  }
}

//Pagination - change page----------------------
pageNewerBtn.addEventListener('click', () => {
  if (currentPage > 1) {
    loadComments(currentPage - 1);
    scrollToCommentTop();
  }
});

pageOlderBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    loadComments(currentPage + 1);
    scrollToCommentTop();
  }
});


//last step----------------------------------------
// wait for all events configure successfully
loadComments(1);


//========================Helper functions===================

//reply submit---------------------------------------
 function handleReplySubmit(form, parentId, parentName) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('.reply-form-buttons-submit');
    const rawContent = form.querySelector('textarea').value;
    const finalContent = `@${parentName}: ${rawContent}`;

    // Debounce - Prevent duplicate submission
    if(submitBtn.disabled) return;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Honeypot validation
    if (data.website) {
      alert('Spam detected.');
      resetBtn(submitBtn, 'Comment');
      return;
    }

    try {
      const res = await fetch('https://yuki-me-backend.onrender.com/comments', {
      //const res = await fetch('http://127.0.0.1:3000/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name, 
          email: data.email,
          content: finalContent,//parentName added
          parentId: parentId
        })
      });

      if (!res.ok) throw new Error('Reply failed');

      const overlay = form.closest('.reply-modal-overlay');
      if (overlay) overlay.remove();
      
      activeReplyForm = null;
      await loadComments();

    } catch (err) {
      alert('Failed to reply.');
      console.error(err);
      //resetBtn(submitBtn, 'Reply');
    }finally {
      if (overlay) overlay.remove();
    }

  });
}


// Render Logic--------------------------------
// entry point
function renderComments(list) {
  if (!list || list.length === 0) return '';
  return list.map(root => buildRootStructure(root)).join('');
}
//build single root comment with hidden
function buildRootStructure(root) {
  const rootHTML = createSingleCommentHTML(root, 0); 
  
  //if no children comment, return rootHtml
  if (!root.children || root.children.length === 0) {
    return rootHTML;
  }

  //if has children ,get all children(first used to display)
  const firstChild = root.children[0];
  const otherSiblings = root.children.slice(1);

  // 1. 
  const firstChildHTML = createSingleCommentHTML(firstChild, 1);

  // 2. Hidden Box
  // Part A: Level 2+ of First Child
  // Part B: all other Siblings
  
  const partA_Html = renderFullTree(firstChild.children, 2); // A
  const partB_Html = renderFullTree(otherSiblings, 1);       //B, C...

  // if Part A,B is empty, doesnt need "show more" button
  if (!partA_Html && !partB_Html) {
    return rootHTML + firstChildHTML;
  }

  return `
    ${rootHTML}
    ${firstChildHTML}
    
    <div class="hidden-replies-container">
      ${partA_Html}
      ${partB_Html}
    </div>

    <div class="toggle-replies">
      <button class="replies-showmore">
        - Show more replies -
      </button>
    </div>
  `;
}

// recursively fetch Hidden Box with all comments
function renderFullTree(list, level) {
  if (!list || list.length === 0) return '';
  return list.map(c => {
    const currentHTML = createSingleCommentHTML(c, level);
    const childrenHTML = renderFullTree(c.children, level + 1);
    return currentHTML + childrenHTML;
  }).join('');
}

// build single comment itself HTML without children
function createSingleCommentHTML(c, level) {
  // Flat：Level 0 no indent，Level > 0  20px indent each level
  const marginLeft = level * 35; 
  const initial = c.name.charAt(0);
  const bgColor = getAvatarColor(c.name);

  return `
    <div class="generate-comment" style="margin-left:${marginLeft}px;">
      <div class="generate-comment-header">
        <div class="avatar-initial" style="background-color: ${bgColor};">
          ${initial}
        </div>

        <div class="generate-comment-header-left">
          <div class="generate-comment-name">${c.name}</div>
          <span class="generate-comment-time" >
            ${new Date(c.createdAt).toLocaleString()}
          </span>
        </div>

        <div class="generate-comment-reply" data-id="${c._id}" data-name="${c.name}">
          <svg width=24 height=20 viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M6.4 3.80353C7.55322 2.26658 10 3.08182 10 5.00302V8.00928C14.6772 7.86093 17.7771 9.50672 19.7796 11.7657C21.8614 14.1142 22.6633 17.0184 22.9781 18.9028C23.116 19.7283 22.5806 20.3237 22.0149 20.5275C21.4711 20.7234 20.7467 20.6283 20.2749 20.0531C18.6945 18.1261 15.5 15.4884 10 15.4884V18.997C10 20.9182 7.55321 21.7334 6.4 20.1965L1.6 13.7992C0.800001 12.733 0.800001 11.267 1.6 10.2008L6.4 3.80353ZM8 5.00302L3.2 11.4003C2.93333 11.7557 2.93333 12.2443 3.2 12.5997L8 18.997V14.5C8 13.9477 8.44772 13.5 9 13.5H10C17 13.5 20.6009 17.4621 20.6009 17.4621C20.1828 16.0361 19.4749 14.4371 18.2829 13.0924C16.7183 11.3273 14.5 10 10 10H9C8.44772 10 8 9.55228 8 9V5.00302Z" ></path> </g></svg>
        </div>
      </div>
      <div class="generate-comment-content" >${c.content}</div>

    </div>
  `;
}

function scrollToCommentTop() {
  // scroll back to nav
  const target = document.getElementById('sayhi-nav-comment'); 
  
  if (target) {
    target.scrollIntoView({ 
      behavior: 'smooth', 
      block: 'start' // why start is end, end is start?
    });
  }
}


function updatePaginationUI() {
  // 1. update the num
  currentPageSpan.textContent = currentPage;
  totalPageSpan.textContent = totalPages;

  // 2. "Newer" if first page, can't click
  if (currentPage <= 1) {
    pageNewerBtn.style.opacity = '0.2';
    pageNewerBtn.style.pointerEvents = 'none'; //click forbidden
  } else {
    pageNewerBtn.style.opacity = '1';
    pageNewerBtn.style.pointerEvents = 'auto';
  }

  // 3. "Oldest"
  if (currentPage >= totalPages) {
    pageOlderBtn.style.opacity = '0.2';
    pageOlderBtn.style.pointerEvents = 'none';
  } else {
    pageOlderBtn.style.opacity = '1';
    pageOlderBtn.style.pointerEvents = 'auto';
  }
}

function resetBtn(btn, text) {
  btn.disabled = false;
  btn.textContent = text;
}

function getAvatarColor(name) {
  const colors = [
    '#a4c1f8',
    '#c0afff',
    '#a5c2f8',
    '#9be5f4',
    '#cbf3eb',
    '#cfefd7',
    '#d9f5d1',
    '#d8f7af',
    '#fadaac',
    '#f4f3b7',
    '#c0dbf2',

    '#fbe5aa',
    '#edf49f',
    '#a4d2f8',
    '#b4effa',
    '#aef9e9',
    '#b5f7c2',
    '#f2f7b5',
    '#e5f4d1',
    '#f6d3be',
    '#fab2a5',
  ];
  
  let hash = 0;
  if (!name) return colors[0];

  //sum up all chars in name to prevent common first letters
  for (let i = 0; i < name.length; i++) {
    hash = hash*31 + name.charCodeAt(i);  //31 is Odd Prime  // and for bit shift (i << 5) - i
  }
  return colors[hash % colors.length];
}


//snow------------------------------
function createSnow() {
  const snow = document.createElement('div');
  snow.className = 'snow';

  snow.style.left = Math.random() * 80 + 'vw';// num for position
  snow.style.animationDuration = 5 + Math.random() * 5 + 's';//for speed

  const size = 4+Math.random()*11;//for generating random snow size
  //snow is square
  snow.style.width = size +'px';
  snow.style.height = size +'px';

  snowArea.appendChild(snow);

 //delete snow div after certain minutes,otherwise exist forever
  setTimeout(() => {
    snow.remove();
  }, 10000);//when delete the snow flower div
}

function sendClicksToServer(countToAdd) {
  fetch('https://yuki-me-backend.onrender.com/api/snow-clicks', {
  //fetch('http://127.0.0.1:3000/api/snow-clicks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ incrementBy: countToAdd }) 
  }).catch(err => console.error("failed to update snow num:", err));
}