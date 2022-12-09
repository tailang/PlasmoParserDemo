//把需要一直运行的、启动就运行的以及全局代码放里面去执行
export {}
 
console.log(
  "Live now; make now always the most precious time. Now will never come again."
)

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {    
	const {method, args} = request;
    if (method === "add") {
        const sum = args[0] + args[1]
        sendResponse({res: sum});
    } else {
        sendResponse({res: "unkown"})
    }
});
