        T  �        ���������XXgT�+�pG�����VU            4�  �var Server = IgeClass.extend({
	c RId: '& B',
	
 �: true,

	init: function (op ps) {
		a �;self = this;
		ige.timeScale(1);

		// Define an object to hold references �our player entities
		] . �s = {};

   u @.npc D[];
+ �director 	� Uarray�  t �tile dataC   IDataB �Add the s%�-side game methods / event handler� �implement(`�NetworkE- ,s)_ n �ing component[DaddC �(IgeNetIo 1)
	I XStartK �   .  .s% g(2000,��F N� Ahas 0 ued so s` � aengine7  � Y S tsuccessZ  [ �Check ifD ? ` / Rfully1 .ifE F �reate som� �commands we will need3  � � d ('� hTiles' 
�, clientId, requestId� � 	console.log('C+  N � � received fromR � id "' +a � + '" with�1:', � 2Sen�~ back
	� �response(� ,��#);7 }d tE�#y'D G_onP A � ControlLeftDownJ  /);K ORighL  M /UpJ /UpG  . I  +/Up)/Up'/Up%I /UpF    /Up/Up�on('connect8 C 5); �pd in ./��?es/o ?.jsk ?disn D q #��y stream�� �S3 
�  .L �.sendInterval(30) >an 0upd:@once��ry 30 millisecondsS �� ^ � �ccept incom8�< :� 6 C$ (~�u #cem!		�PmainS ` = new� 62d(Eid(') '\ B  HogroundH / ' jmount(� l Oforel / l 
4 ! � viewport �=setNR// it6�"look" at as�w, 1ZFjust5 ci id abov�6vp1� V � 7vp1� �autoSize� z �  PdrawB#9#*igUGener9brandomP1for
�p texturBpB  �	2 -b
n�
 +�Gwhen.

sG 5a "1"�'  c � d, x, ym � �(x = 0; x < N�worldSettings.getW QWidthb  �7x++�F yF yF 
 He1G yG 	� � = Math.ceil(
 Ye() * 4&)		�m[x] =  $||u,�We assign [0,P] her  �a
 !suv1tha�@ 5	
"us�� Index 0. If youf 1dif�tE 3 s�O 0Map Bn wao mH  h �
 % QalterS 0 @what�~1 Q M [yP"v}�	f
��InitializeD>(�$}
,
 !}
:
 ��typeof(module) !== 'unid' && " 0.exs* J) { # � = Server; }
