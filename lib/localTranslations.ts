import type { Language } from '@/types/chat';

export const LOCAL_TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Welcome & System Messages
    'WELCOME_MESSAGE': 'Hi! Welcome to PugArch FSM Support.\nI can help you resolve common app issues instantly.\nPlease select the type of problem you are facing.',
    'SOMETHING_ELSE_MESSAGE': 'Describe your issue in as much detail as you can, and I will try to help you.',
    'LOW_CONFIDENCE_MESSAGE': 'I found a few possible solutions. Which one matches your issue?',
    'NO_MATCH_MESSAGE': 'I was not able to find a solution for this issue in our support database. Please share your details and our support team will contact you.',
    'ESCALATION_MESSAGE': 'Sorry the solution did not work. Please share the following details so our support team can help you directly.',
    'HELPFUL_YES_MESSAGE': 'Great! Glad I could help.\nIf you face any other issue, you can start again anytime.',
    'SUCCESS_MESSAGE': 'Your issue has been shared with the support team. They will contact you shortly.',
    'PRIVACY_NOTE': 'Please do not share passwords, OTPs, Aadhaar, PAN, or payment details. Share only basic contact and issue information required for support.',
    
    // Categories
    'Login & Account': '🔐 Login & Account',
    'Location, GPS & Geofence': '📍 Location & GPS',
    'Attendance & Check-in': '📋 Attendance',
    'App Crashes & Errors': '💥 App Crashes',
    'Sync & Data Issues': '🔄 Sync & Data',
    'Attendance & Tracking': '📋 Attendance & Tracking',
    'App Crashes & Performance': '💥 App Crashes & Perf',
    'Data & Sync': '🔄 Data & Sync',
    
    // Buttons
    'Yes': 'Yes',
    'No': 'No',
    'Submit': 'Submit',
    'Cancel': 'Cancel',
    'Start New Chat': 'Start New Chat',
    'My issue is different': 'My issue is different',
    
    // Form Labels
    'Full Name *': 'Full Name *',
    'Contact Number *': 'Contact Number *',
    'Designation *': 'Designation *',
    'Department *': 'Department *',
    'Describe Your Issue *': 'Describe Your Issue *',
    
    // Placeholders
    'e.g., John Doe': 'e.g., John Doe',
    'e.g., 9876543210': 'e.g., 9876543210',
    'e.g., Security Guard': 'e.g., Security Guard',
    'e.g., Security': 'e.g., Security',
    'Please describe the issue you faced...': 'Please describe the issue you faced...',
    'Type a message...': 'Type a message...',
  },
  hi: {
    'WELCOME_MESSAGE': 'नमस्ते! पुगआर्च एफ़एसएम सहायता में आपका स्वागत है।\nमैं आपकी ऐप की आम समस्याओं को तुरंत हल करने में मदद कर सकता हूँ।\nकृपया अपनी समस्या का प्रकार चुनें।',
    'SOMETHING_ELSE_MESSAGE': 'अपनी समस्या का जितना हो सके विस्तार से वर्णन करें, और मैं आपकी सहायता करने का प्रयास करूँगा।',
    'LOW_CONFIDENCE_MESSAGE': 'मुझे कुछ संभावित समाधान मिले हैं। आपकी समस्या से कौन सा मेल खाता है?',
    'NO_MATCH_MESSAGE': 'मुझे हमारे डेटाबेस में इस समस्या का समाधान नहीं मिला। कृपया अपना विवरण साझा करें और हमारी टीम आपसे संपर्क करेगी।',
    'ESCALATION_MESSAGE': 'क्षमा करें, समाधान काम नहीं आया। कृपया निम्नलिखित विवरण साझा करें ताकि हमारी सहायता टीम आपकी सीधे मदद कर सके।',
    'HELPFUL_YES_MESSAGE': 'बहुत बढ़िया! खुशी हुई कि मैं मदद कर सका।\nयदि आपको कोई अन्य समस्या आती है, तो आप कभी भी फिर से शुरू कर सकते हैं।',
    'SUCCESS_MESSAGE': 'आपकी समस्या सहायता टीम के साथ साझा कर दी गई है। वे जल्द ही आपसे संपर्क करेंगे।',
    'PRIVACY_NOTE': 'कृपया पासवर्ड, ओटीपी, आधार, पैन या भुगतान विवरण साझा न करें। सहायता के लिए आवश्यक केवल बुनियादी संपर्क और समस्या की जानकारी साझा करें।',
    
    'Login & Account': '🔐 लॉगिन और खाता',
    'Location, GPS & Geofence': '📍 स्थान और जीपीएस',
    'Attendance & Check-in': '📋 उपस्थिति',
    'App Crashes & Errors': '💥 ऐप क्रैश',
    'Sync & Data Issues': '🔄 सिंक और डेटा',
    'Attendance & Tracking': '📋 उपस्थिति और ट्रैकिंग',
    'App Crashes & Performance': '💥 ऐप क्रैश और प्रदर्शन',
    'Data & Sync': '🔄 डेटा और सिंक',
    
    'Yes': 'हाँ',
    'No': 'नहीं',
    'Submit': 'जमा करें',
    'Cancel': 'रद्द करें',
    'Start New Chat': 'नया चैट शुरू करें',
    'My issue is different': 'मेरी समस्या अलग है',
    
    'Full Name *': 'पूरा नाम *',
    'Contact Number *': 'संपर्क नंबर *',
    'Designation *': 'पद *',
    'Department *': 'विभाग *',
    'Describe Your Issue *': 'अपनी समस्या का वर्णन करें *',
    
    'e.g., John Doe': 'जैसे, राम कुमार',
    'e.g., 9876543210': 'जैसे, 9876543210',
    'e.g., Security Guard': 'जैसे, सुरक्षा गार्ड',
    'e.g., Security': 'जैसे, सुरक्षा',
    'Please describe the issue you faced...': 'कृपया अपनी समस्या का वर्णन करें...',
    'Type a message...': 'संदेश लिखें...',
  },
  mr: {
    'WELCOME_MESSAGE': 'नमस्कार! पुगआर्च एफएसएम सपोर्टमध्ये आपले स्वागत आहे.\nमी आपल्याला ॲपमधील सामान्य समस्या त्वरित सोडविण्यास मदत करू शकतो.\nकृपया आपल्या समस्येचा प्रकार निवडा.',
    'SOMETHING_ELSE_MESSAGE': 'आपल्या समस्येचे जितके शक्य तितके तपशीलवार वर्णन करा, आणि मी आपल्याला मदत करण्याचा प्रयत्न करेन.',
    'LOW_CONFIDENCE_MESSAGE': 'मला काही संभाव्य उपाय सापडले आहेत. आपल्या समस्येशी कोणता जुळतो?',
    'NO_MATCH_MESSAGE': 'मला आमच्या डेटाबेसमध्ये या समस्येचा उपाय सापडला नाही. कृपया आपले तपशील सामायिक करा आणि आमचे सपोर्ट टीम आपल्याशी संपर्क साधेल.',
    'ESCALATION_MESSAGE': 'क्षमस्व, उपाय काम करत नाही. कृपया खालील तपशील सामायिक करा जेणेकरून आमचे सपोर्ट टीम थेट आपल्याला मदत करू शकेल.',
    'HELPFUL_YES_MESSAGE': 'उत्कृष्ट! मला आनंद आहे की मी मदत करू शकलो.\nआपल्याला इतर कोणतीही समस्या आल्यास, आपण कधीही पुन्हा सुरू करू शकता.',
    'SUCCESS_MESSAGE': 'आपली समस्या सपोर्ट टीमकडे पाठवण्यात आली आहे. ते लवकरच आपल्याशी संपर्क साधतील.',
    'PRIVACY_NOTE': 'कृपया पासवर्ड, ओटीपी, आधार, पॅन किंवा पेमेंट तपशील सामायिक करू नका. केवळ मूलभूत संपर्क आणि समस्येची माहिती सामायिक करा.',
    
    'Login & Account': '🔐 लॉगिन आणि खाते',
    'Location, GPS & Geofence': '📍 स्थान आणि जीपीएस',
    'Attendance & Check-in': '📋 उपस्थिती',
    'App Crashes & Errors': '💥 ॲप क्रॅश',
    'Sync & Data Issues': '🔄 सिंक आणि डेटा',
    'Attendance & Tracking': '📋 उपस्थिती आणि ट्रॅकिंग',
    'App Crashes & Performance': '💥 ॲप क्रॅश आणि परफॉर्मन्स',
    'Data & Sync': '🔄 डेटा आणि सिंक',
    
    'Yes': 'होय',
    'No': 'नाही',
    'Submit': 'सादर करा',
    'Cancel': 'रद्द करा',
    'Start New Chat': 'नवीन चॅट सुरू करा',
    'My issue is different': 'माझी समस्या वेगळी आहे',
    
    'Full Name *': 'पूर्ण नाव *',
    'Contact Number *': 'संपर्क क्रमांक *',
    'Designation *': 'पद *',
    'Department *': 'विभाग *',
    'Describe Your Issue *': 'समस्येचे वर्णन करा *',
    
    'e.g., John Doe': 'उदा., राहुल पाटील',
    'e.g., 9876543210': 'उदा., 9876543210',
    'e.g., Security Guard': 'उदा., सुरक्षा रक्षक',
    'e.g., Security': 'उदा., सुरक्षा',
    'Please describe the issue you faced...': 'कृपया आपल्या समस्येचे वर्णन करा...',
    'Type a message...': 'संदेश लिहा...',
  },
  or: {
    'WELCOME_MESSAGE': 'ନମସ୍କାର! ପୁଗଆର୍ଚ FSM ସହାୟତାକୁ ଆପଣଙ୍କୁ ସ୍ୱାଗତ।\nମୁଁ ଆପଣଙ୍କୁ ଆପ୍ ର ସାଧାରଣ ସମସ୍ୟାଗୁଡ଼ିକ ତୁରନ୍ତ ସମାଧାନ କରିବାରେ ସାହାଯ୍ୟ କରିପାରିବି।\nଦୟାକରି ଆପଣଙ୍କର ସମସ୍ୟା ବାଛନ୍ତୁ।',
    'SOMETHING_ELSE_MESSAGE': 'ଆପଣଙ୍କର ସମସ୍ୟା ବିଷୟରେ ଯଥାସମ୍ଭବ ବିସ୍ତୃତ ଭାବରେ ବର୍ଣ୍ଣନା କରନ୍ତୁ, ଏବଂ ମୁଁ ଆପଣଙ୍କୁ ସାହାଯ୍ୟ କରିବାକୁ ଚେଷ୍ଟା କରିବି।',
    'LOW_CONFIDENCE_MESSAGE': 'ମୁଁ କିଛି ସମ୍ଭାବ୍ୟ ସମାଧାନ ପାଇଛି। ଆପଣଙ୍କ ସମସ୍ୟା ସହିତ କେଉଁଟି ମେଳ ଖାଉଛି?',
    'NO_MATCH_MESSAGE': 'ଆମର ଡାଟାବେସରେ ଏହି ସମସ୍ୟାର ସମାଧାନ ମିଳିଲା ନାହିଁ। ଦୟାକରି ଆପଣଙ୍କର ବିବରଣୀ ପ୍ରଦାନ କରନ୍ତୁ ଏବଂ ଆମର ସହାୟତା ଦଳ ଆପଣଙ୍କ ସହ ଯୋଗାଯୋଗ କରିବେ।',
    'ESCALATION_MESSAGE': 'ଦୁଃଖିତ, ସମାଧାନ କାମ କଲାନାହିଁ। ଦୟାକରି ନିମ୍ନଲିଖିତ ବିବରଣୀ ପ୍ରଦାନ କରନ୍ତୁ ଯେପରି ଆମର ସହାୟତା ଦଳ ଆପଣଙ୍କୁ ସିଧାସଳଖ ସାହାଯ୍ୟ କରିପାରିବେ।',
    'HELPFUL_YES_MESSAGE': 'ବହୁତ ବଢ଼ିଆ! ମୁଁ ସାହାଯ୍ୟ କରିପାରିଥିବାରୁ ଖୁସି।\nଯଦି ଆପଣ କୌଣସି ଅନ୍ୟ ସମସ୍ୟାର ସମ୍ମୁଖୀନ ହୁଅନ୍ତି, ଆପଣ ଯେକୌଣସି ସମୟରେ ପୁଣି ଆରମ୍ଭ କରିପାରିବେ।',
    'SUCCESS_MESSAGE': 'ଆପଣଙ୍କର ସମସ୍ୟା ସହାୟତା ଦଳ ସହିତ ଶେୟାର କରାଯାଇଛି। ସେମାନେ ଶୀଘ୍ର ଆପଣଙ୍କ ସହ ଯୋଗାଯୋଗ କରିବେ।',
    'PRIVACY_NOTE': 'ଦୟାକରି ପାସୱାର୍ଡ, ଓଟିପି, ଆଧାର, ପାନ କିମ୍ବା ପେମେଣ୍ଟ ବିବରଣୀ ଶେୟାର କରନ୍ତୁ ନାହିଁ। କେବଳ ମୌଳିକ ଯୋଗାଯୋଗ ଏବଂ ସମସ୍ୟା ସୂଚନା ପ୍ରଦାନ କରନ୍ତୁ।',
    
    'Login & Account': '🔐 ଲଗଇନ୍ ଏବଂ ଆକାଉଣ୍ଟ',
    'Location, GPS & Geofence': '📍 ସ୍ଥାନ ଏବଂ ଜିପିଏସ',
    'Attendance & Check-in': '📋 ଉପସ୍ଥାପନ',
    'App Crashes & Errors': '💥 ଆପ୍ କ୍ରାସ୍',
    'Sync & Data Issues': '🔄 ସିଙ୍କ୍ ଏବଂ ଡାଟା',
    'Attendance & Tracking': '📋 ଉପସ୍ଥାପନ ଏବଂ ଟ୍ରାକିଂ',
    'App Crashes & Performance': '💥 ଆପ୍ କ୍ରାସ୍ ଏବଂ ପ୍ରଦର୍ଶନ',
    'Data & Sync': '🔄 ଡାଟା ଏବଂ ସିଙ୍କ୍',
    
    'Yes': 'ହଁ',
    'No': 'ନାହିଁ',
    'Submit': 'ଦାଖଲ କରନ୍ତୁ',
    'Cancel': 'ବାତିଲ୍ କରନ୍ତୁ',
    'Start New Chat': 'ନୂଆ ଚାଟ୍ ଆରମ୍ଭ କରନ୍ତୁ',
    'My issue is different': 'ମୋର ସମସ୍ୟା ଅଲଗା',
    
    'Full Name *': 'ପୂରା ନାମ *',
    'Contact Number *': 'ଯୋଗାଯୋଗ ନମ୍ବର *',
    'Designation *': 'ପଦବୀ *',
    'Department *': 'ବିଭାଗ *',
    'Describe Your Issue *': 'ସମସ୍ୟାର ବର୍ଣ୍ଣନା *',
    
    'e.g., John Doe': 'ଯେପରିକି, ରାମ ଦାସ',
    'e.g., 9876543210': 'ଯେପରିକି, 9876543210',
    'e.g., Security Guard': 'ଯେପରିକି, ସୁରକ୍ଷା ଗାର୍ଡ',
    'e.g., Security': 'ଯେପରିକି, ସୁରକ୍ଷା',
    'Please describe the issue you faced...': 'ଦୟାକରି ଆପଣଙ୍କ ସମସ୍ୟା ବର୍ଣ୍ଣନା କରନ୍ତୁ...',
    'Type a message...': 'ବାର୍ତ୍ତା ଲେଖନ୍ତୁ...',
  },
  bn: {
    'WELCOME_MESSAGE': 'নমস্কার! পুগআর্চ এফএসএম সাপোর্টে আপনাকে স্বাগত।\nআমি আপনাকে অ্যাপের সাধারণ সমস্যাগুলি অবিলম্বে সমাধান করতে সাহায্য করতে পারি।\nদয়া করে আপনার সমস্যার ধরণটি নির্বাচন করুন।',
    'SOMETHING_ELSE_MESSAGE': 'আপনার সমস্যার কথা যতটা সম্ভব বিশদভাবে বর্ণনা করুন এবং আমি আপনাকে সাহায্য করার চেষ্টা করব।',
    'LOW_CONFIDENCE_MESSAGE': 'আমি কিছু সম্ভাব্য সমাধান পেয়েছি। আপনার সমস্যার সাথে কোনটি মিলছে?',
    'NO_MATCH_MESSAGE': 'আমি আমাদের ডাটাবেসে এই সমস্যার কোনো সমাধান খুঁজে পাইনি। দয়া করে আপনার বিবরণ দিন এবং আমাদের টিম আপনার সাথে যোগাযোগ করবে।',
    'ESCALATION_MESSAGE': 'দুঃখিত, সমাধানটি কাজ করেনি। দয়া করে নিম্নলিখিত বিবরণ দিন যাতে আমাদের সাপোর্ট টিম আপনাকে সরাসরি সাহায্য করতে পারে।',
    'HELPFUL_YES_MESSAGE': 'দারুণ! সাহায্য করতে পেরে ভালো লাগছে।\nযদি আপনি অন্য কোনো সমস্যার সম্মুখীন হন, তবে যেকোনো সময় আবার শুরু করতে পারেন।',
    'SUCCESS_MESSAGE': 'আপনার সমস্যাটি সাপোর্ট টিমের সাথে শেয়ার করা হয়েছে। তারা শীঘ্রই আপনার সাথে যোগাযোগ করবে।',
    'PRIVACY_NOTE': 'দয়া করে পাসওয়ার্ড, ওটিপি, আধার, প্যান বা পেমেন্টের বিবরণ শেয়ার করবেন না। শুধুমাত্র প্রয়োজনীয় মৌলিক যোগাযোগের তথ্য প্রদান করুন।',
    
    'Login & Account': '🔐 লগইন এবং অ্যাকাউন্ট',
    'Location, GPS & Geofence': '📍 স্থান এবং জিপিএস',
    'Attendance & Check-in': '📋 উপস্থিতি',
    'App Crashes & Errors': '💥 অ্যাপ ক্র্যাশ',
    'Sync & Data Issues': '🔄 সিঙ্ক এবং ডেটা',
    'Attendance & Tracking': '📋 উপস্থিতি এবং ট্র্যাকিং',
    'App Crashes & Performance': '💥 অ্যাপ ক্র্যাশ এবং পারফরম্যান্স',
    'Data & Sync': '🔄 ডেటా এবং সিঙ্ক',
    
    'Yes': 'হ্যাঁ',
    'No': 'না',
    'Submit': 'জমা দিন',
    'Cancel': 'বাতিল করুন',
    'Start New Chat': 'নতুন চ্যাট শুরু করুন',
    'My issue is different': 'আমার সমস্যাটি আলাদা',
    
    'Full Name *': 'পুরো নাম *',
    'Contact Number *': 'যোগাযোগ নম্বর *',
    'Designation *': 'পদবী *',
    'Department *': 'বিভাগ *',
    'Describe Your Issue *': 'আপনার সমস্যা বর্ণনা করুন *',
    
    'e.g., John Doe': 'যেমন, রতন সেন',
    'e.g., 9876543210': 'যেমন, 9876543210',
    'e.g., Security Guard': 'যেমন, সিকিউরিটি গার্ড',
    'e.g., Security': 'যেমন, সিকিউরিটি',
    'Please describe the issue you faced...': 'দয়া করে আপনার সমস্যাটি বর্ণনা করুন...',
    'Type a message...': 'বার্তা লিখুন...',
  },
  ta: {
    'WELCOME_MESSAGE': 'வணக்கம்! புகார்க் எஃப்எஸ்எம் ஆதரவிற்கு உங்களை வரவேற்கிறோம்.\nசெயலியின் பொதுவான சிக்கல்களை உடனுக்குடன் தீர்க்க நான் உங்களுக்கு உதவ முடியும்.\nதயவுசெய்து உங்கள் சிக்கலின் வகையைத் தேர்ந்தெடுக்கவும்.',
    'SOMETHING_ELSE_MESSAGE': 'உங்கள் சிக்கலை முடிந்தவரை விரிவாக விளக்கவும், நான் உங்களுக்கு உதவ முயற்சிக்கிறேன்.',
    'LOW_CONFIDENCE_MESSAGE': 'நான் சில சாத்தியமான தீர்வுகளைக் கண்டறிந்துள்ளேன். உங்கள் சிக்கலுடன் எது பொருந்துகிறது?',
    'NO_MATCH_MESSAGE': 'எங்கள் தரவுத்தளத்தில் இந்த சிக்கலுக்கான தீர்வு கிடைக்கவில்லை. தயவுசெய்து உங்கள் விவரங்களைப் பகிரவும், எங்கள் ஆதரவுக் குழு உங்களைத் தொடர்புகொள்ளும்.',
    'ESCALATION_MESSAGE': 'வருந்துகிறோம், தீர்வு பலனளிக்கவில்லை. எங்கள் ஆதரவுக் குழு உங்களுக்கு நேரடியாக உதவ பின்வரும் விவரங்களைப் பகிரவும்.',
    'HELPFUL_YES_MESSAGE': 'அருமை! உதவியதில் மகிழ்ச்சி.\nவேறு ஏதேனும் சிக்கல் ஏற்பட்டால், நீங்கள் எப்போது வேண்டுமானாலும் மீண்டும் தொடங்கலாம்.',
    'SUCCESS_MESSAGE': 'உங்கள் சிக்கல் ஆதரவுக் குழுவுடன் பகிரப்பட்டது. அவர்கள் விரைவில் உங்களைத் தொடர்புகொள்வார்கள்.',
    'PRIVACY_NOTE': 'தயவுசெய்து கடவுச்சொற்கள், ஓடிபி, ஆதார், பான் அல்லது கட்டண விவரங்களைப் பகிர வேண்டாம். ஆதரவுக்குத் தேவையான அடிப்படை விவரங்களை மட்டும் பகிரவும்.',
    
    'Login & Account': '🔐 உள்நுழைவு & கணக்கு',
    'Location, GPS & Geofence': '📍 இருப்பிடம் & ஜிபிஎஸ்',
    'Attendance & Check-in': '📋 வருகைப் பதிவு',
    'App Crashes & Errors': '💥 செயலி முடக்கம்',
    'Sync & Data Issues': '🔄 ஒத்திசைவு & தரவு',
    'Attendance & Tracking': '📋 வருகைப் பதிவு & கண்காணிப்பு',
    'App Crashes & Performance': '💥 செயலி முடக்கம் & செயல்திறன்',
    'Data & Sync': '🔄 தரவு & ஒத்திசைவு',
    
    'Yes': 'ஆம்',
    'No': 'இல்லை',
    'Submit': 'சமர்ப்பி',
    'Cancel': 'ரத்துசெய்',
    'Start New Chat': 'புதிய அரட்டையைத் தொடங்கு',
    'My issue is different': 'எனது சிக்கல் வேறுபட்டது',
    
    'Full Name *': 'முழு பெயர் *',
    'Contact Number *': 'தொடர்பு எண் *',
    'Designation *': 'பதவி *',
    'Department *': 'துறை *',
    'Describe Your Issue *': 'உங்கள் சிக்கலை விவரிக்கவும் *',
    
    'e.g., John Doe': 'எ.கா., கார்த்திக்',
    'e.g., 9876543210': 'எ.கா., 9876543210',
    'e.g., Security Guard': 'எ.கா., பாதுகாப்பு காவலர்',
    'e.g., Security': 'எ.கா., பாதுகாப்பு',
    'Please describe the issue you faced...': 'தயவுசெய்து நீங்கள் எதிர்கொண்ட சிக்கலை விவரிக்கவும்...',
    'Type a message...': 'செய்தியை தட்டச்சு செய்யவும்...',
  },
  te: {
    'WELCOME_MESSAGE': 'నమస్కారం! పుగ్‌ఆర్చ్ FSM సపోర్ట్‌కి స్వాగతం.\nయాప్‌లో వచ్చే సాధారణ సమస్యలను త్వరగా పరిష్కరించడంలో నేను మీకు సహాయపడతాను.\nదయచేసి మీ సమస్య రకాన్ని ఎంచుకోండి.',
    'SOMETHING_ELSE_MESSAGE': 'మీ సమస్య గురించి వీలైనంత వివరంగా తెలియజేయండి, నేను సహాయం చేయడానికి ప్రయత్నిస్తాను.',
    'LOW_CONFIDENCE_MESSAGE': 'నేను కొన్ని సంభావ్య పరిష్కారాలను కనుగొన్నాను. మీ సమస్యకు ఏది సరిపోతుంది?',
    'NO_MATCH_MESSAGE': 'మా డేటాబేస్‌లో ఈ సమస్యకు పరిష్కారం లభించలేదు. దయచేసి మీ వివరాలను పంచుకోండి, మా బృందం మిమ్మల్ని సంప్రదిస్తుంది.',
    'ESCALATION_MESSAGE': 'క్షమించండి, పరిష్కారం పని చేయలేదు. మా బృందం మీకు నేరుగా సహాయపడటానికి దయచేసి క్రింది వివరాలను పంచుకోండి.',
    'HELPFUL_YES_MESSAGE': 'చాలా సంతోషం! మీకు సహాయపడినందుకు ఆనందంగా ఉంది.\nమరేదైనా సమస్య ఎదురైతే, మీరు ఎప్పుడైనా మళ్లీ ప్రారంభించవచ్చు.',
    'SUCCESS_MESSAGE': 'మీ సమస్య సపోర్ట్ టీమ్‌కు చేరింది. వారు త్వరలోనే మిమ్మల్ని సంప్రదిస్తారు.',
    'PRIVACY_NOTE': 'దయచేసి పాస్‌వర్డ్‌లు, ఓటీపీలు, ఆధార్, పాన్ లేదా పేమెంట్ వివరాలను పంచుకోవద్దు. కేవలం అవసరమైన సమాచారాన్ని మాత్రమే అందించండి.',
    
    'Login & Account': '🔐 లాగిన్ & ఖాతా',
    'Location, GPS & Geofence': '📍 లొకేషన్ & జీపీఎస్',
    'Attendance & Check-in': '📋 హాజరు',
    'App Crashes & Errors': '💥 యాప్ క్రాష్‌లు',
    'Sync & Data Issues': '🔄 సింక్ & డేటా',
    'Attendance & Tracking': '📋 హాజరు & ట్రాకింగ్',
    'App Crashes & Performance': '💥 యాప్ క్రాష్‌లు & పనితీరు',
    'Data & Sync': '🔄 డేటా & సింక్',
    
    'Yes': 'అవును',
    'No': 'కాదు',
    'Submit': 'సమర్పించు',
    'Cancel': 'రద్దు చేయి',
    'Start New Chat': 'కొత్త చాట్ ప్రారంభించు',
    'My issue is different': 'నా సమస్య వేరేది',
    
    'Full Name *': 'పూర్తి పేరు *',
    'Contact Number *': 'సంప్రదింపు సంఖ్య *',
    'Designation *': 'హోదా *',
    'Department *': 'విభాగం *',
    'Describe Your Issue *': 'మీ సమస్యను వివరించండి *',
    
    'e.g., John Doe': 'ఉదా., రామ్ ప్రసాద్',
    'e.g., 9876543210': 'ఉదా., 9876543210',
    'e.g., Security Guard': 'ఉదా., సెక్యూరిటీ గార్డ్',
    'e.g., Security': 'ఉదా., సెక్యూరిటీ',
    'Please describe the issue you faced...': 'దయచేసి మీ సమస్యను వివరించండి...',
    'Type a message...': 'సందేశాన్ని టైప్ చేయండి...',
  },
  kn: {
    'WELCOME_MESSAGE': 'ನಮಸ್ಕಾರ! ಪುಗ್‌ಆರ್ಚ್ FSM ಬೆಂಬಲಕ್ಕೆ ನಿಮಗೆ ಸ್ವಾಗತ.\nಆಪ್‌ನ ಸಾಮಾನ್ಯ ಸಮಸ್ಯೆಗಳನ್ನು ತಕ್ಷಣವೇ ಪರಿಹರಿಸಲು ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ.\nದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಮಸ್ಯೆಯ ಪ್ರಕಾರವನ್ನು ಆರಿಸಿ.',
    'SOMETHING_ELSE_MESSAGE': 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಸಾಧ್ಯವಾದಷ್ಟು ವಿವರವಾಗಿ ವಿವರಿಸಿ, ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡಲು ಪ್ರಯತ್ನಿಸುತ್ತೇನೆ.',
    'LOW_CONFIDENCE_MESSAGE': 'ನನಗೆ ಕೆಲವು ಸಂಭಾವ್ಯ ಪರಿಹಾರಗಳು ಕಂಡುಬಂದಿವೆ. ನಿಮ್ಮ ಸಮಸ್ಯೆಗೆ ಯಾವುದು ಸೂಕ್ತವಾಗಿದೆ?',
    'NO_MATCH_MESSAGE': 'ನಮ್ಮ ಡೇಟಾಬೇಸ್‌ನಲ್ಲಿ ಈ ಸಮಸ್ಯೆಗೆ ಯಾವುದೇ ಪರಿಹಾರ ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ ಮತ್ತು ನಮ್ಮ ತಂಡ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತದೆ.',
    'ESCALATION_MESSAGE': 'ಕ್ಷಮಿಸಿ, ಪರಿಹಾರ ಕೆಲಸ ಮಾಡಲಿಲ್ಲ. ನಮ್ಮ ತಂಡ ನಿಮಗೆ ನೇರವಾಗಿ ಸಹಾಯ ಮಾಡಲು ದಯವಿಟ್ಟು ಕೆಳಗಿನ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.',
    'HELPFUL_YES_MESSAGE': 'ಉತ್ತಮ! ಸಹಾಯ ಮಾಡಲು ಸಂತೋಷವಾಗಿದೆ.\nನಿಮಗೆ ಬೇರೆ ಯಾವುದೇ ಸಮಸ್ಯೆ ಎದುರಾದರೆ, ನೀವು ಯಾವಾಗ ಬೇಕಾದರೂ ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಬಹುದು.',
    'SUCCESS_MESSAGE': 'ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ಬೆಂಬಲ ತಂಡಕ್ಕೆ ಕಳುಹಿಸಲಾಗಿದೆ. ಅವರು ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಲಿದ್ದಾರೆ.',
    'PRIVACY_NOTE': 'ದಯವಿಟ್ಟು ಪಾಸ್‌ವರ್ಡ್‌ಗಳು, ಒಟಿಪಿ, ಆಧಾರ್, ಪಾನ್ ಅಥವಾ ಪಾವತಿ ವಿವರಗಳನ್ನು ಹಂಚಿಕೊಳ್ಳಬೇಡಿ. ಕೇವಲ ಮೂಲಭೂತ ಸಂಪರ್ಕ ಮತ್ತು ಸಮಸ್ಯೆಯ ವಿವರ ಹಂಚಿಕೊಳ್ಳಿ.',
    
    'Login & Account': '🔐 ಲಾಗಿನ್ ಮತ್ತು ಖಾತೆ',
    'Location, GPS & Geofence': '📍 ಸ್ಥಳ ಮತ್ತು ಜಿಪಿಎಸ್',
    'Attendance & Check-in': '📋 ಹಾಜರಾತಿ',
    'App Crashes & Errors': '💥 ಆಪ್ ಕ್ರ್ಯಾಶ್',
    'Sync & Data Issues': '🔄 ಸಿಂಕ್ ಮತ್ತು ಡೇಟಾ',
    'Attendance & Tracking': '📋 ಹಾಜರಾತಿ ಮತ್ತು ಟ್ರ್ಯಾಕಿಂಗ್',
    'App Crashes & Performance': '💥 ಆಪ್ ಕ್ರ್ಯಾಶ್ ಮತ್ತು ಕಾರ್ಯಕ್ಷಮತೆ',
    'Data & Sync': '🔄 ಡೇಟಾ ಮತ್ತು ಸಿಂಕ್',
    
    'Yes': 'ಹೌದು',
    'No': 'ಇಲ್ಲ',
    'Submit': 'ಸಲ್ಲಿಸು',
    'Cancel': 'ರದ್ದು ಮಾಡು',
    'Start New Chat': 'ಹೊಸ ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ',
    'My issue is different': 'ನನ್ನ ಸಮಸ್ಯೆ ಬೇರೆಯಾಗಿದೆ',
    
    'Full Name *': 'ಪೂರ್ಣ ಹೆಸರು *',
    'Contact Number *': 'ಸಂಪರ್ಕ ಸಂಖ್ಯೆ *',
    'Designation *': 'ಹುದ್ದೆ *',
    'Department *': 'ವಿಭಾಗ *',
    'Describe Your Issue *': 'ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ *',
    
    'e.g., John Doe': 'ಉದಾ., ರಾಜೇಶ್',
    'e.g., 9876543210': 'ಉದಾ., 9876543210',
    'e.g., Security Guard': 'ಉದಾ., ಭದ್ರತಾ ಸಿಬ್ಬಂದಿ',
    'e.g., Security': 'ಉದಾ., ಭದ್ರತೆ',
    'Please describe the issue you faced...': 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ವಿವರಿಸಿ...',
    'Type a message...': 'ಸಂದೇಶ ಟೈಪ್ ಮಾಡಿ...',
  },
  gu: {
    'WELCOME_MESSAGE': 'નમસ્તે! પુગઆર્ચ FSM સપોર્ટમાં તમારું સ્વાગત છે.\nહું તમને એપની સામાન્ય સમસ્યાઓ તાત્કાલિક ઉકેલવામાં મદદ કરી શકું છું.\nકૃપા કરીને તમારી સમસ્યાનો પ્રકાર પસંદ કરો.',
    'SOMETHING_ELSE_MESSAGE': 'તમારી સમસ્યા વિશે બને તેટલી વિગતવાર માહિતી આપો, અને હું તમને મદદ કરવાનો પ્રયાસ કરીશ.',
    'LOW_CONFIDENCE_MESSAGE': 'મને કેટલાક સંભવિત ઉકેલો મળ્યા છે. તમારી સમસ્યા સાથે કયો મેળ ખાય છે?',
    'NO_MATCH_MESSAGE': 'અમારા ડેટાબેઝમાં આ સમસ્યાનો કોઈ ઉકેલ મળ્યો નથી. કૃપા કરીને તમારી વિગતો આપો અને અમારી ટીમ તમારો સંપર્ક કરશે.',
    'ESCALATION_MESSAGE': 'માફ કરશો, ઉકેલ કામ ન આવ્યો. અમારી ટીમ સીધી મદદ કરી શકે તે માટે કૃપા કરીને નીચેની વિગતો આપો.',
    'HELPFUL_YES_MESSAGE': 'ખૂબ સરસ! મદદ કરી શકવા બદલ આનંદ થયો.\nજો તમને બીજી કોઈ સમસ્યા આવે, તો તમે ગમે ત્યારે ફરી શરૂ કરી શકો છો.',
    'SUCCESS_MESSAGE': 'તમારી સમસ્યા સપોર્ટ ટીમ સાથે શેર કરવામાં આવી છે. તેઓ ટૂંક સમયમાં તમારો સંપર્ક કરશે.',
    'PRIVACY_NOTE': 'કૃપા કરીને પાસવર્ડ, ઓટીપી, આધાર, પાન કે પેમેન્ટ વિગતો શેર કરશો નહીં. માત્ર જરૂરી મૂળભૂત સંપર્ક માહિતી આપો.',
    
    'Login & Account': '🔐 લોગિન અને ખાતું',
    'Location, GPS & Geofence': '📍 સ્થાન અને જીપીએસ',
    'Attendance & Check-in': '📋 હાજરી',
    'App Crashes & Errors': '💥 એપ ક્રેશ',
    'Sync & Data Issues': '🔄 સિંક અને ડેટા',
    'Attendance & Tracking': '📋 હાજરી અને ટ્રેકિંગ',
    'App Crashes & Performance': '💥 એપ ક્રેશ અને પરફોર્મન્સ',
    'Data & Sync': '🔄 ડેટા અને સિંક',
    
    'Yes': 'હા',
    'No': 'ના',
    'Submit': 'સબમિટ કરો',
    'Cancel': 'રદ કરો',
    'Start New Chat': 'નવી ચેટ શરૂ કરો',
    'My issue is different': 'મારી સમસ્યા અલગ છે',
    
    'Full Name *': 'પૂરું નામ *',
    'Contact Number *': 'સંપર્ક નંબર *',
    'Designation *': 'હોદ્દો *',
    'Department *': 'વિભાગ *',
    'Describe Your Issue *': 'તમારી સમસ્યાનું વર્ણન કરો *',
    
    'e.g., John Doe': 'દા.ત., અજય મહેતા',
    'e.g., 9876543210': 'દા.ત., 9876543210',
    'e.g., Security Guard': 'દા.ત., સિક્યુરિટી ગાર્ડ',
    'e.g., Security': 'દા.ત., સિક્યુરિટી',
    'Please describe the issue you faced...': 'કૃપા કરીને તમારી સમસ્યાનું વર્ણન કરો...',
    'Type a message...': 'સંદેશો લખો...',
  },
};

export function getLocalTranslation(text: string, language: Language): string {
  if (language === 'en') return text;
  
  // Try exact lookup in local dictionary
  const dictionary = LOCAL_TRANSLATIONS[language];
  if (dictionary && dictionary[text]) {
    return dictionary[text];
  }
  
  // Stripped check (remove prefixes or suffixes to find match)
  const cleanKey = text.replace(/^[🔐📍📋💥🔄🔒💡🤖💬📝📤⏳✉️ ]+/, '').trim();
  if (dictionary) {
    for (const [key, value] of Object.entries(dictionary)) {
      const cleanDictKey = key.replace(/^[🔐📍📋💥🔄🔒💡🤖💬📝📤⏳✉️ ]+/, '').trim();
      if (cleanKey === cleanDictKey) {
        return value;
      }
    }
  }
  
  return text;
}
