let db=firebase.firestore();
let ul=document.querySelector('.list');
let inpBox=document.querySelector('.inp');
let addBtn=document.querySelector('.addBtn');
let clearBtn=document.querySelector('.clear');

addBtn.onclick=addItem
// clearBtn.onclick=empty
let docIds=[]

async function deleteAll()
{
    let docs=await db.collection('board').get();
    docs.forEach(doc=>
    {
        // console.log(doc.id);
        docIds.push(doc.id);
    });

    docIds.forEach(docId=>{
        db.collection('board').doc(docId).delete();
    })
    docIds=[]
}


async function empty()
{
    while(ul.lastChild)
    {
        ul.removeChild(ul.lastChild);
    }
    // let li=document.createElement('li');
    // let span=document.createElement('span');
    // span.innerText='Nothing to share.'
    // li.appendChild(span);
    // li.classList.add('placeholder');
    // ul.appendChild(li);
    deleteAll().then(()=>{
    //     // console.log('All items Delete from firebase');
    })
    // db.collection('board').delete();
}

function validURL(str) {
  let pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

function renderItems()
{

    db.collection('board').onSnapshot((snapshot)=>{

        snapshot.docChanges().forEach(change=>{
            // console.log(change.type);
            let docId=change.doc.id;
            if (change.type === "removed") {
                // console.log("Removed city: ", change.doc.data());
                // console.log(conti);
                // continue;
                // let remId=change.doc.id;
                let removedElement=document.getElementById(docId);
                if(removedElement)
                    ul.removeChild(removedElement);
                return;
            }
            // if(ul.childElementCount==1 && ul.firstElementChild.classList[0]=='placeholder')
            //     ul.removeChild(ul.firstElementChild);
            let doc=change.doc;
            let val=doc.data().content;
            let li=document.createElement('li');
            li.classList.add('list__item');
            li.setAttribute('id',docId);
            let button=document.createElement('button');
            let img=document.createElement('img')
            img.src='/assets/deleteIcon.png'
            // button.innerText='❌';
            img.classList.add('removeIcon')
            button.appendChild(img);
            button.onclick=()=>{
                let toBeRemoved=document.getElementById(docId)
                ul.removeChild(toBeRemoved);
                db.collection('board').doc(docId).delete().then(docRef=>{
                    console.log('Document Deleted');
                })
                // console.log(doc.id);
            }
            button.classList.add('removeBtn');
            li.appendChild(button);
            if(validURL(val))
            {
                let a=document.createElement('a');
                a.classList.add('content');
                a.innerText=val;
                a.href=val;
                a.setAttribute('target','_blank');
                li.appendChild(a);
            }
            else
            {
                let span=document.createElement('span');
                span.innerText=val;
                span.classList.add('content');
                li.appendChild(span);
            }
            ul.appendChild(li);
            // console.log(doc.data());
            // inpBox.value='';
        })
    })
    
}
renderItems()
function addItem(e){
    let val=inpBox.value.trim()
    inpBox.value='';
    if(val.length!=0)
    {
        db.collection('board').add({content:val}).then((docRef)=>{
            // console.log(docRef);
            console.log('Added');
        })
    }
    // else
    //     console.log('Empty');
}
// console.log(btn);