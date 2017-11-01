const fun = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(fun.config().firebase);

exports.addMessage = fun.https.onRequest((req, res)=>{
	// http 요청에서 ?다음에 있는 변수중에 text 변수 값을 가져온다
	var text = req.query.text;
	// 파이어베이스 db의 message 레퍼런스에 그 값을 넣는다.
	admin.database().ref('/message')
		.push({msg:text})
		.then(snapshot => {
			res.end("success!!!");
		});
});

//-- fcm 설정
const fcmServerUrl = "https://fcm.googleapis.com/fcm/send";
const serverKey = "AAAA57rN1nU:APA91bF2yYQqGJnrT8KZFzeVdgV4BAPcREy0d8n57nCNix16LEkd2PYngl8kBw8FEDZA94XwLe8sLgNrVt-3mJFzqQN77ghIDBp11qgY9N9MFp0az-wjZLtdsi3fCI4-kAuwwTsQToeX";

exports.sendNotification = fun.https.onRequest((req, res)=>{
	// json 데이터로 post 값을 수신
	var dataObj = req.body;
	/* dataObj 의 형태
		{
			to : "상대방 토큰",
			msg : "메시지"
		}
	*/
	// 전송할 메시지 객체를 완성
	var msg = {
		notification : {
			title : "노티바에 나타나는 타이틀",
			body : dataObj.msg
		}
	};
	var tokens = [];
	tokens.push(dataObj.to);
	var result = admin.messaging().sendToDevice(tokens, msg);
	res.end(JSON.stringify(result));

});