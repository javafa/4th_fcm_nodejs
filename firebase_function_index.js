const fun = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(fun.config().firebase);

exports.sendNotification = fun.https.onRequest((req, res)=>{
	// json 데이터로 post 값을 수신
	var dataObj = req.body;
	var msg = {
		notification : {
			title : "노티바에 나타나는 타이틀",
			body : dataObj.msg,
			sound : "default",
			click_action : "<intent-filter><action name='여기이름'/></intent-filter>"
		}
	};
	var tokens = [];
	tokens.push(dataObj.to);
	admin.messaging().sendToDevice(tokens, msg)
	.then(function(response){
		res.status(200).send(response);
	})
	.catch(function(error){
		res.status(501).send(error);
	});
});