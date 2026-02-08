// Register Service Worker for offline support
if ('serviceWorker' in navigator && ['http:', 'https:'].includes(window.location.protocol)) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed', err));
    });
}

function injectIcons() {
    if (!window.ICONS) return;
    for (const [id, content] of Object.entries(window.ICONS)) {
        const el = document.getElementById(id);
        if (el && el.tagName.toLowerCase() === 'svg') {
            el.innerHTML = content;
        }
    }
}

async function main(){
    try {
        injectIcons();
        await runMain();
        // Hide loading screen after everything is initialized
        const ls = document.getElementById('loadingScreen');
        if (ls) {
            setTimeout(() => {
                ls.style.transition = 'opacity 0.5s';
                ls.style.opacity = '0';
                setTimeout(() => ls.style.display = 'none', 500);
            }, 1000);
        }
    } catch (e) {
        console.error("Critical error in main loop:", e);
        alert("A critical error occurred while starting the game: " + e.message);
    }
}

async function runMain(){

    function copyThumbnail(t){

        if(!window.innerWidth){
            setTimeout(copyThumbnail,100)
            return
        }
        let canv=document.getElementById(t+'_thumbnailCanvCopy')

        let ctx=canv.getContext('2d')

        canv.width=window.innerWidth
        canv.height=window.innerHeight

        ctx.drawImage(document.getElementById('thumbnailCanv'),0,0)
    }

    document.getElementById('mainNew').onclick=function(){
        if(confirm("This will reload the page. Any unsaved progress will be lost. Continue?")) {
            window.location.reload();
        }
    }
    document.getElementById('mainNew').innerText = "Reload Game";

    let addedDivsToSplice=[],ableToImport,printedCode

    document.getElementById('mainTest').onclick=function(){
        window.testMode = true;
        document.getElementById('mainMenu').style.display='none'
        BeeSwarmSimulator({id:Date.now(),name:'Test Mode Save'})
    }

    document.getElementById('mainPlay').onclick=function(){

        copyThumbnail('select')

        document.getElementById('mainMenu').style.display='none'
        document.getElementById('mainSelectMenu').style.display='block'

        document.getElementById('createNewGame').onclick=function(){

            document.getElementById('mainSelectMenu').style.display='none'
            document.getElementById('mainMenu').style.display='none'

            BeeSwarmSimulator({id:Date.now(),name:'Untitled Save'})
        }

        document.getElementById('createImportedGame').onclick=function(){

            alert("\nTo import a game, you'll need a string containing the saved data of the game. Copy the string, and then use CTRL+V in this program to start the game.\n\nAn invalid code will create an error message. There is a chance errors in the save code are not detected and pass through. This may corrupt the game, resulting in crashes.")
        }

        document.onpaste=(e)=>{

            if(!ableToImport) return

            ableToImport=false

            let text=e.clipboardData.getData('text/plain')

            document.getElementById('mainSelectMenu').style.display='none'
            document.getElementById('mainMenu').style.display='none'

            BeeSwarmSimulator({id:Date.now(),saveCode:text,name:'Untitled Import'})
        }

        for(let i in addedDivsToSplice){

            document.getElementById('savedGames').removeChild(addedDivsToSplice[i])
        }

        let div=document.createElement('div')

        ableToImport=true
        addedDivsToSplice=[div]

        div.innerHTML="<p class='no-saves-message'>You have no saves. Start a new game or import one.<br><br>Data is saved to this computer's browser via IndexedDB. To transfer data across multiple devices, use the export save file feature.<br><br>It is recommended to save backups of the save file in the event of deleted IndexedDB.<br><br>Data may not be saved after abruptly closing the game. Data will not be saved while in incognito/private browser modes.</p>"

        document.getElementById('savedGames').appendChild(div)

        loadFromDB().then(res=>{

            window.initSave=function(index){

                document.getElementById('mainSelectMenu').style.display='none'
                document.getElementById('mainInfoMenu').style.display='none'
                document.getElementById('mainMenu').style.display='none'

                BeeSwarmSimulator({id:res[index].id,name:res[index].data.name,saveCode:res[index].data.saveCode})
            }

            window.deleteSave=function(index){

                if(confirm('\nDo you really want to delete save "'+res[index].data.name+'"?')){

                    deleteSaveConfirmation=false
                    deleteFromDB(res[index].id)
                    document.getElementById('mainPlay').onclick()
                }
            }

            window.renameSave=function(index){

                deleteFromDB(res[index].id)

                saveToDB(res[index].id,{

                    lastSaved:Date.now(),
                    saveCode:res[index].data.saveCode,
                    name:document.getElementById('saveName'+index).value
                })

                document.getElementById('mainPlay').onclick()
            }

            window.getSave=function(index){

                navigator.clipboard.writeText(res[index].data.saveCode).then(()=>{

                    alert('\nThe save code for save "'+res[index].data.name+'" has been copied to your clipboard.')

                }).catch(e=>{

                    if(printedCode){

                        document.getElementById('savedGames').removeChild(printedCode)
                    }

                    let div=document.createElement('div')

                    printedCode=div

                    div.innerHTML="<div class='save-code-display'><br><br>"+res[index].data.saveCode+'<br><br><br><br><br></div>'

                    document.getElementById('savedGames').appendChild(div)
                    addedDivsToSplice.push(div)

                    alert('\nThere was an error copying the save code for save "'+res[index].data.name+'" to your clipboard. The code has been printed at the bottom of the page instead.')
                })
            }

            res.sort((a,b)=>b.data.lastSaved-a.data.lastSaved)

            if(res.length){

                for(let i in addedDivsToSplice){

                    document.getElementById('savedGames').removeChild(addedDivsToSplice[i])
                }

                addedDivsToSplice=[]
            }

            for(let i in res){

                let div=document.createElement('div')
                div.className = 'save-item';

                addedDivsToSplice.push(div)

                let date=new Date(res[i].data.lastSaved),dgh=date.getHours()

                let lastSavedDate=`${(date.getMonth()+1).toString().padStart(2,'0')}/${date.getDate().toString().padStart(2,'0')}/${date.getFullYear()}&nbsp;&nbsp;${(dgh>=12?dgh-12:dgh).toString().padStart(2,'0').replace('00','12')}:${date.getMinutes().toString().padStart(2,'0')}:${date.getSeconds().toString().padStart(2,'0')} ${dgh>=12?'PM':'AM'}`

                div.innerHTML=`
                    <input id='saveName${i}' class='save-name-input' spellcheck='false' size='17' value='${res[i].data.name}' onchange='window.renameSave(${i})'>
                    <div class='save-date'>Last Saved: ${lastSavedDate}</div>
                    <div class='save-buttons-container'>
                        <div class='save-btn play-btn' onclick='window.initSave(${i})'>Play</div>
                        <div class='save-btn export-btn' onclick='window.getSave(${i})'>Export</div>
                        <div class='save-btn delete-btn' onclick='window.deleteSave(${i})'>Delete</div>
                    </div>
                `;

                document.getElementById('savedGames').appendChild(div)
            }

        }).catch(e=>{
            console.error("Error loading saves:", e);
            let div=document.createElement('div')

            addedDivsToSplice.push(div)

            div.innerHTML="<p class='error-message'>Error loading from IndexedDB. IndexedDB may not be supported.</p>"

            document.getElementById('savedGames').appendChild(div)
        })
    }

    document.getElementById('mainInfo').onclick=function(){

        copyThumbnail('info')

        document.getElementById('mainMenu').style.display='none'
        document.getElementById('mainInfoMenu').style.display='block'
    }

    document.getElementById('info_mainBack').onclick=document.getElementById('select_mainBack').onclick=function(){

        document.getElementById('mainInfoMenu').style.display='none'
        document.getElementById('mainSelectMenu').style.display='none'
        document.getElementById('mainMenu').style.display='block'
    }

    window.drawThumbnail(document.getElementById('thumbnailCanv'))

}

var _M=Math
