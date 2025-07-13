// Blog Summarizer API
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { 
  SupabaseService, 
  MongoService, 
  generateContentHash, 
  calculateProcessingStats,
  type BlogSummary,
  type BlogContent
} from '@/lib/database';

// English to Urdu translation dictionary
const translationDict: Record<string, string> = {
  // Common words
  'the': 'یہ',
  'and': 'اور',
  'of': 'کا',
  'to': 'کو',
  'a': 'ایک',
  'in': 'میں',
  'is': 'ہے',
  'it': 'یہ',
  'you': 'آپ',
  'that': 'وہ',
  'he': 'وہ',
  'was': 'تھا',
  'for': 'کے لیے',
  'are': 'ہیں',
  'with': 'کے ساتھ',
  'as': 'جیسا',
  'his': 'اس کا',
  'they': 'وہ',
  'be': 'ہونا',
  'at': 'پر',
  'one': 'ایک',
  'have': 'ہے',
  'this': 'یہ',
  'from': 'سے',
  'or': 'یا',
  'had': 'تھا',
  'by': 'کی طرف سے',
  'but': 'لیکن',
  'not': 'نہیں',
  'what': 'کیا',
  'all': 'تمام',
  'were': 'تھے',
  'we': 'ہم',
  'when': 'جب',
  'your': 'آپ کا',
  'can': 'کر سکتے ہیں',
  'said': 'کہا',
  'there': 'وہاں',
  'each': 'ہر',
  'which': 'جو',
  'how': 'کیسے',
  'their': 'ان کا',
  'will': 'گا',
  'about': 'کے بارے میں',
  'if': 'اگر',
  'up': 'اوپر',
  'out': 'باہر',
  'many': 'بہت سے',
  'then': 'پھر',
  'them': 'انہیں',
  'these': 'یہ',
  'so': 'تو',
  'some': 'کچھ',
  'her': 'اس کا',
  'would': 'گا',
  'make': 'بنانا',
  'like': 'جیسے',
  'into': 'میں',
  'him': 'اسے',
  'time': 'وقت',
  'has': 'ہے',
  'two': 'دو',
  'more': 'زیادہ',
  'very': 'بہت',
  'after': 'بعد',
  'words': 'الفاظ',
  'first': 'پہلا',
  'where': 'کہاں',
  'did': 'کیا',
  'get': 'حاصل کرنا',
  'through': 'کے ذریعے',
  'back': 'واپس',
  'much': 'زیادہ',
  'before': 'پہلے',
  'go': 'جانا',
  'good': 'اچھا',
  'new': 'نیا',
  'write': 'لکھنا',
  'our': 'ہمارا',
  'used': 'استعمال',
  'me': 'مجھے',
  'man': 'آدمی',
  'too': 'بھی',
  'any': 'کوئی',
  'day': 'دن',
  'same': 'وہی',
  'right': 'دائیں',
  'look': 'دیکھو',
  'think': 'سوچنا',
  'also': 'بھی',
  'around': 'ارد گرد',
  'another': 'دوسرا',
  'came': 'آیا',
  'come': 'آنا',
  'work': 'کام',
  'three': 'تین',
  'must': 'چاہیے',
  'because': 'کیونکہ',
  'does': 'کرتا ہے',
  'part': 'حصہ',
  'even': 'یہاں تک',
  'place': 'جگہ',
  'well': 'اچھی طرح',
  'such': 'ایسا',
  'here': 'یہاں',
  'take': 'لینا',
  'why': 'کیوں',
  'things': 'چیزیں',
  'help': 'مدد',
  'put': 'رکھنا',
  'years': 'سال',
  'different': 'مختلف',
  'away': 'دور',
  'again': 'دوبارہ',
  'off': 'بند',
  'went': 'گیا',
  'old': 'پرانا',
  'number': 'نمبر',
  'great': 'عظیم',
  'tell': 'بتانا',
  'men': 'مرد',
  'say': 'کہنا',
  'small': 'چھوٹا',
  'every': 'ہر',
  'found': 'ملا',
  'still': 'اب بھی',
  'between': 'کے درمیان',
  'name': 'نام',
  'should': 'چاہیے',
  'home': 'گھر',
  'big': 'بڑا',
  'give': 'دینا',
  'air': 'ہوا',
  'line': 'لائن',
  'set': 'سیٹ',
  'own': 'اپنا',
  'under': 'نیچے',
  'read': 'پڑھنا',
  'last': 'آخری',
  'never': 'کبھی نہیں',
  'us': 'ہمیں',
  'left': 'بائیں',
  'end': 'اختتام',
  'along': 'ساتھ',
  'while': 'جبکہ',
  'might': 'ہو سکتا ہے',
  'next': 'اگلا',
  'sound': 'آواز',
  'below': 'نیچے',
  'saw': 'دیکھا',
  'something': 'کچھ',
  'thought': 'سوچا',
  'both': 'دونوں',
  'few': 'کچھ',
  'those': 'وہ',
  'always': 'ہمیشہ',
  'show': 'دکھانا',
  'large': 'بڑا',
  'often': 'اکثر',
  'together': 'ایک ساتھ',
  'asked': 'پوچھا',
  'house': 'گھر',
  'don\'t': 'نہیں',
  'world': 'دنیا',
  'going': 'جا رہا',
  'want': 'چاہتے ہیں',
  'school': 'اسکول',
  'important': 'اہم',
  'until': 'تک',
  'form': 'شکل',
  'food': 'کھانا',
  'keep': 'رکھنا',
  'children': 'بچے',
  'feet': 'پاؤں',
  'land': 'زمین',
  'side': 'طرف',
  'without': 'کے بغیر',
  'boy': 'لڑکا',
  'once': 'ایک بار',
  'animal': 'جانور',
  'life': 'زندگی',
  'enough': 'کافی',
  'took': 'لیا',
  'sometimes': 'کبھی کبھی',
  'four': 'چار',
  'head': 'سر',
  'above': 'اوپر',
  'kind': 'قسم',
  'began': 'شروع',
  'almost': 'تقریبا',
  'live': 'زندہ',
  'page': 'صفحہ',
  'got': 'ملا',
  'earth': 'زمین',
  'need': 'ضرورت',
  'far': 'دور',
  'hand': 'ہاتھ',
  'high': 'اعلیٰ',
  'year': 'سال',
  'mother': 'ماں',
  'light': 'روشنی',
  'country': 'ملک',
  'father': 'باپ',
  'let': 'چلو',
  'night': 'رات',
  'picture': 'تصویر',
  'being': 'ہونا',
  'study': 'مطالعہ',
  'second': 'دوسرا',
  'soon': 'جلد',
  'story': 'کہانی',
  'since': 'جب سے',
  'white': 'سفید',
  'ever': 'کبھی',
  'paper': 'کاغذ',
  'hard': 'مشکل',
  'near': 'قریب',
  'sentence': 'جملہ',
  'better': 'بہتر',
  'best': 'بہترین',
  'across': 'پار',
  'during': 'دوران',
  'today': 'آج',
  'however': 'تاہم',
  'sure': 'یقین',
  'knew': 'جانتا تھا',
  'it\'s': 'یہ ہے',
  'try': 'کوشش',
  'told': 'بتایا',
  'young': 'جوان',
  'sun': 'سورج',
  'thing': 'چیز',
  'whole': 'پورا',
  'hear': 'سننا',
  'example': 'مثال',
  'heard': 'سنا',
  'several': 'کئی',
  'change': 'تبدیلی',
  'answer': 'جواب',
  'room': 'کمرہ',
  'sea': 'سمندر',
  'against': 'کے خلاف',
  'top': 'اوپر',
  'turned': 'بدل گیا',
  'learn': 'سیکھنا',
  'point': 'نقطہ',
  'city': 'شہر',
  'play': 'کھیل',
  'toward': 'کی طرف',
  'five': 'پانچ',
  'himself': 'خود',
  'usually': 'عام طور پر',
  'money': 'پیسہ',
  'seen': 'دیکھا',
  'didn\'t': 'نہیں',
  'car': 'گاڑی',
  'morning': 'صبح',
  'I\'m': 'میں ہوں',
  'body': 'جسم',
  'upon': 'پر',
  'family': 'خاندان',
  'later': 'بعد میں',
  'turn': 'موڑ',
  'move': 'حرکت',
  'face': 'چہرہ',
  'door': 'دروازہ',
  'cut': 'کاٹنا',
  'done': 'کیا',
  'group': 'گروپ',
  'true': 'سچ',
  'leave': 'چھوڑنا',
  'red': 'سرخ',
  'friend': 'دوست',
  'began': 'شروع',
  'idea': 'خیال',
  'fish': 'مچھلی',
  'mountain': 'پہاڑ',
  'north': 'شمال',
  'once': 'ایک بار',
  'base': 'بنیاد',
  'hear': 'سننا',
  'horse': 'گھوڑا',
  'cut': 'کاٹنا',
  'sure': 'یقین',
  'watch': 'دیکھنا',
  'color': 'رنگ',
  'wood': 'لکڑی',
  'main': 'اہم',
  'enough': 'کافی',
  'plain': 'سادہ',
  'girl': 'لڑکی',
  'usual': 'معمول',
  'young': 'جوان',
  'ready': 'تیار',
  'above': 'اوپر',
  'ever': 'کبھی',
  'red': 'سرخ',
  'list': 'فہرست',
  'though': 'اگرچہ',
  'feel': 'محسوس',
  'talk': 'بات',
  'bird': 'پرندہ',
  'soon': 'جلد',
  'body': 'جسم',
  'dog': 'کتا',
  'family': 'خاندان',
  'direct': 'براہ راست',
  'pose': 'پیش',
  'leave': 'چھوڑنا',
  'song': 'گانا',
  'measure': 'پیمائش',
  'state': 'ریاست',
  'product': 'مصنوعات',
  'black': 'کالا',
  'short': 'مختصر',
  'numeral': 'عدد',
  'class': 'کلاس',
  'wind': 'ہوا',
  'question': 'سوال',
  'happen': 'ہونا',
  'complete': 'مکمل',
  'ship': 'جہاز',
  'area': 'علاقہ',
  'half': 'آدھا',
  'rock': 'چٹان',
  'order': 'حکم',
  'fire': 'آگ',
  'south': 'جنوب',
  'problem': 'مسئلہ',
  'piece': 'ٹکڑا',
  'told': 'بتایا',
  'knew': 'جانتا تھا',
  'pass': 'پاس',
  'since': 'جب سے',
  'top': 'اوپر',
  'whole': 'پورا',
  'king': 'بادشاہ',
  'space': 'جگہ',
  'heard': 'سنا',
  'best': 'بہترین',
  'hour': 'گھنٹہ',
  'better': 'بہتر',
  'during': 'دوران',
  'hundred': 'سو',
  'five': 'پانچ',
  'remember': 'یاد',
  'step': 'قدم',
  'early': 'جلدی',
  'hold': 'پکڑنا',
  'west': 'مغرب',
  'ground': 'زمین',
  'interest': 'دلچسپی',
  'reach': 'پہنچنا',
  'fast': 'تیز',
  'verb': 'فعل',
  'sing': 'گانا',
  'listen': 'سننا',
  'six': 'چھ',
  'table': 'میز',
  'travel': 'سفر',
  'less': 'کم',
  'morning': 'صبح',
  'ten': 'دس',
  'simple': 'آسان',
  'several': 'کئی',
  'vowel': 'حروف علت',
  'toward': 'کی طرف',
  'war': 'جنگ',
  'lay': 'رکھنا',
  'against': 'کے خلاف',
  'pattern': 'نمونہ',
  'slow': 'آہستہ',
  'center': 'مرکز',
  'love': 'محبت',
  'person': 'شخص',
  'money': 'پیسہ',
  'serve': 'خدمت',
  'appear': 'ظاہر',
  'road': 'سڑک',
  'map': 'نقشہ',
  'rain': 'بارش',
  'rule': 'اصول',
  'govern': 'حکومت',
  'pull': 'کھینچنا',
  'cold': 'ٹھنڈا',
  'notice': 'نوٹس',
  'voice': 'آواز',
  'unit': 'یونٹ',
  'power': 'طاقت',
  'town': 'شہر',
  'fine': 'ٹھیک',
  'certain': 'مخصوص',
  'fly': 'اڑنا',
  'fall': 'گرنا',
  'lead': 'قیادت',
  'cry': 'رونا',
  'dark': 'اندھیرا',
  'machine': 'مشین',
  'note': 'نوٹ',
  'wait': 'انتظار',
  'plan': 'منصوبہ',
  'figure': 'شکل',
  'star': 'ستارہ',
  'box': 'ڈبہ',
  'noun': 'اسم',
  'field': 'کھیت',
  'rest': 'آرام',
  'correct': 'درست',
  'able': 'قابل',
  'pound': 'پاؤنڈ',
  'done': 'کیا',
  'beauty': 'خوبصورتی',
  'drive': 'چلانا',
  'stood': 'کھڑا',
  'contain': 'شامل',
  'front': 'سامنے',
  'teach': 'سکھانا',
  'week': 'ہفتہ',
  'final': 'حتمی',
  'gave': 'دیا',
  'green': 'سبز',
  'oh': 'اوہ',
  'quick': 'تیز',
  'develop': 'ترقی',
  'ocean': 'سمندر',
  'warm': 'گرم',
  'free': 'آزاد',
  'minute': 'منٹ',
  'strong': 'مضبوط',
  'special': 'خاص',
  'mind': 'دماغ',
  'behind': 'پیچھے',
  'clear': 'صاف',
  'tail': 'دم',
  'produce': 'پیدا',
  'fact': 'حقیقت',
  'street': 'گلی',
  'inch': 'انچ',
  'multiply': 'ضرب',
  'nothing': 'کچھ نہیں',
  'course': 'کورس',
  'stay': 'رہنا',
  'wheel': 'پہیہ',
  'full': 'مکمل',
  'force': 'طاقت',
  'blue': 'نیلا',
  'object': 'اعتراض',
  'decide': 'فیصلہ',
  'surface': 'سطح',
  'deep': 'گہرا',
  'moon': 'چاند',
  'island': 'جزیرہ',
  'foot': 'پاؤں',
  'system': 'نظام',
  'busy': 'مصروف',
  'test': 'ٹیسٹ',
  'record': 'ریکارڈ',
  'boat': 'کشتی',
  'common': 'عام',
  'gold': 'سونا',
  'possible': 'ممکن',
  'plane': 'طیارہ',
  'stead': 'جگہ',
  'dry': 'خشک',
  'wonder': 'حیرت',
  'laugh': 'ہنسنا',
  'thousands': 'ہزاروں',
  'ago': 'پہلے',
  'ran': 'بھاگا',
  'check': 'چیک',
  'game': 'کھیل',
  'shape': 'شکل',
  'equate': 'برابر',
  'hot': 'گرم',
  'miss': 'کھونا',
  'brought': 'لایا',
  'heat': 'گرمی',
  'snow': 'برف',
  'tire': 'تھکنا',
  'bring': 'لانا',
  'yes': 'ہاں',
  'distant': 'دور',
  'fill': 'بھرنا',
  'east': 'مشرق',
  'paint': 'پینٹ',
  'language': 'زبان',
  'among': 'کے درمیان',
  'grand': 'شاندار',
  'ball': 'گیند',
  'yet': 'ابھی تک',
  'wave': 'لہر',
  'drop': 'قطرہ',
  'heart': 'دل',
  'am': 'ہوں',
  'present': 'موجود',
  'heavy': 'بھاری',
  'dance': 'رقص',
  'engine': 'انجن',
  'position': 'پوزیشن',
  'arm': 'بازو',
  'wide': 'چوڑا',
  'sail': 'بادبان',
  'material': 'مواد',
  'size': 'سائز',
  'vary': 'مختلف',
  'settle': 'بسنا',
  'speak': 'بولنا',
  'weight': 'وزن',
  'general': 'عام',
  'ice': 'برف',
  'matter': 'معاملہ',
  'circle': 'دائرہ',
  'pair': 'جوڑا',
  'include': 'شامل',
  'divide': 'تقسیم',
  'syllable': 'حرف',
  'felt': 'محسوس',
  'perhaps': 'شاید',
  'pick': 'اٹھانا',
  'sudden': 'اچانک',
  'count': 'گننا',
  'square': 'مربع',
  'reason': 'وجہ',
  'length': 'لمبائی',
  'represent': 'نمائندگی',
  'art': 'فن',
  'subject': 'موضوع',
  'region': 'خطہ',
  'energy': 'توانائی',
  'hunt': 'شکار',
  'probable': 'ممکن',
  'bed': 'بستر',
  'brother': 'بھائی',
  'egg': 'انڈا',
  'ride': 'سواری',
  'cell': 'خلیہ',
  'believe': 'یقین',
  'fraction': 'حصہ',
  'forest': 'جنگل',
  'sit': 'بیٹھنا',
  'race': 'دوڑ',
  'window': 'کھڑکی',
  'store': 'دکان',
  'summer': 'گرمی',
  'train': 'ٹرین',
  'sleep': 'سونا',
  'prove': 'ثابت',
  'lone': 'اکیلا',
  'leg': 'ٹانگ',
  'exercise': 'ورزش',
  'wall': 'دیوار',
  'catch': 'پکڑنا',
  'mount': 'پہاڑ',
  'wish': 'خواہش',
  'sky': 'آسمان',
  'board': 'بورڈ',
  'joy': 'خوشی',
  'winter': 'سردی',
  'sat': 'بیٹھا',
  'written': 'لکھا',
  'wild': 'جنگلی',
  'instrument': 'آلہ',
  'kept': 'رکھا',
  'glass': 'گلاس',
  'grass': 'گھاس',
  'cow': 'گائے',
  'job': 'کام',
  'edge': 'کنارہ',
  'sign': 'نشان',
  'visit': 'دورہ',
  'past': 'ماضی',
  'soft': 'نرم',
  'fun': 'مزہ',
  'bright': 'چمکدار',
  'gas': 'گیس',
  'weather': 'موسم',
  'month': 'مہینہ',
  'million': 'ملین',
  'bear': 'ریچھ',
  'finish': 'ختم',
  'happy': 'خوش',
  'hope': 'امید',
  'flower': 'پھول',
  'clothe': 'کپڑے',
  'strange': 'عجیب',
  'gone': 'گیا',
  'jump': 'چھلانگ',
  'baby': 'بچہ',
  'eight': 'آٹھ',
  'village': 'گاؤں',
  'meet': 'ملنا',
  'root': 'جڑ',
  'buy': 'خریدنا',
  'raise': 'اٹھانا',
  'solve': 'حل',
  'metal': 'دھات',
  'whether': 'کیا',
  'push': 'دھکیلنا',
  'seven': 'سات',
  'paragraph': 'پیراگراف',
  'third': 'تیسرا',
  'shall': 'کریں گے',
  'held': 'منعقد',
  'hair': 'بال',
  'describe': 'بیان',
  'cook': 'پکانا',
  'floor': 'فرش',
  'either': 'یا',
  'result': 'نتیجہ',
  'burn': 'جلانا',
  'hill': 'پہاڑی',
  'safe': 'محفوظ',
  'cat': 'بلی',
  'century': 'صدی',
  'consider': 'غور',
  'type': 'قسم',
  'law': 'قانون',
  'bit': 'تھوڑا',
  'coast': 'ساحل',
  'copy': 'کاپی',
  'phrase': 'جملہ',
  'silent': 'خاموش',
  'tall': 'لمبا',
  'sand': 'ریت',
  'soil': 'مٹی',
  'roll': 'رول',
  'temperature': 'درجہ حرارت',
  'finger': 'انگلی',
  'industry': 'صنعت',
  'value': 'قیمت',
  'fight': 'لڑائی',
  'lie': 'جھوٹ',
  'beat': 'مارنا',
  'excite': 'پرجوش',
  'natural': 'قدرتی',
  'view': 'دیکھنا',
  'sense': 'احساس',
  'ear': 'کان',
  'else': 'اور',
  'quite': 'کافی',
  'broke': 'ٹوٹا',
  'case': 'معاملہ',
  'middle': 'درمیان',
  'kill': 'مارنا',
  'son': 'بیٹا',
  'lake': 'جھیل',
  'moment': 'لمحہ',
  'scale': 'پیمانہ',
  'loud': 'اونچی آواز',
  'spring': 'بہار',
  'observe': 'مشاہدہ',
  'child': 'بچہ',
  'straight': 'سیدھا',
  'consonant': 'حروف',
  'nation': 'قوم',
  'dictionary': 'لغت',
  'milk': 'دودھ',
  'speed': 'رفتار',
  'method': 'طریقہ',
  'organ': 'عضو',
  'pay': 'ادائیگی',
  'age': 'عمر',
  'section': 'سیکشن',
  'dress': 'لباس',
  'cloud': 'بادل',
  'surprise': 'حیرت',
  'quiet': 'خاموش',
  'stone': 'پتھر',
  'tiny': 'چھوٹا',
  'climb': 'چڑھنا',
  'bad': 'برا',
  'oil': 'تیل',
  'blood': 'خون',
  'touch': 'چھونا',
  'grew': 'بڑھا',
  'cent': 'سینٹ',
  'mix': 'ملانا',
  'team': 'ٹیم',
  'wire': 'تار',
  'cost': 'لاگت',
  'lost': 'کھو گیا',
  'brown': 'بھورا',
  'wear': 'پہننا',
  'garden': 'باغ',
  'equal': 'برابر',
  'sent': 'بھیجا',
  'choose': 'انتخاب',
  'fell': 'گرا',
  'fit': 'فٹ',
  'flow': 'بہاؤ',
  'fair': 'منصفانہ',
  'bank': 'بینک',
  'collect': 'جمع',
  'save': 'بچانا',
  'control': 'کنٹرول',
  'decimal': 'اعشاریہ',
  'gentle': 'نرم',
  'woman': 'عورت',
  'captain': 'کپتان',
  'practice': 'مشق',
  'separate': 'الگ',
  'difficult': 'مشکل',
  'doctor': 'ڈاکٹر',
  'please': 'برائے کرم',
  'protect': 'محفوظ',
  'noon': 'دوپہر',
  'whose': 'جس کا',
  'locate': 'تلاش',
  'ring': 'انگوٹھی',
  'character': 'کردار',
  'insect': 'کیڑا',
  'caught': 'پکڑا',
  'period': 'مدت',
  'indicate': 'اشارہ',
  'radio': 'ریڈیو',
  'spoke': 'بولا',
  'atom': 'ایٹم',
  'human': 'انسان',
  'history': 'تاریخ',
  'effect': 'اثر',
  'electric': 'برقی',
  'expect': 'توقع',
  'crop': 'فصل',
  'modern': 'جدید',
  'element': 'عنصر',
  'hit': 'مارنا',
  'student': 'طالب علم',
  'corner': 'کونا',
  'party': 'پارٹی',
  'supply': 'فراہمی',
  'bone': 'ہڈی',
  'rail': 'ریل',
  'imagine': 'تصور',
  'provide': 'فراہم',
  'agree': 'اتفاق',
  'thus': 'اس طرح',
  'capital': 'دارالحکومت',
  'won\'t': 'نہیں',
  'chair': 'کرسی',
  'danger': 'خطرہ',
  'fruit': 'پھل',
  'rich': 'امیر',
  'thick': 'موٹا',
  'soldier': 'سپاہی',
  'process': 'عمل',
  'operate': 'چلانا',
  'guess': 'اندازہ',
  'necessary': 'ضروری',
  'sharp': 'تیز',
  'wing': 'پنکھ',
  'create': 'بنانا',
  'neighbor': 'پڑوسی',
  'wash': 'دھونا',
  'bat': 'چمگادڑ',
  'rather': 'بلکہ',
  'crowd': 'ہجوم',
  'corn': 'مکئی',
  'compare': 'موازنہ',
  'poem': 'نظم',
  'string': 'تار',
  'bell': 'گھنٹی',
  'depend': 'انحصار',
  'meat': 'گوشت',
  'rub': 'رگڑنا',
  'tube': 'نلکی',
  'famous': 'مشہور',
  'dollar': 'ڈالر',
  'stream': 'ندی',
  'fear': 'خوف',
  'sight': 'نظر',
  'thin': 'پتلا',
  'triangle': 'مثلث',
  'planet': 'سیارہ',
  'hurry': 'جلدی',
  'chief': 'سربراہ',
  'colony': 'کالونی',
  'clock': 'گھڑی',
  'mine': 'میرا',
  'tie': 'بندھنا',
  'enter': 'داخل',
  'major': 'بڑا',
  'fresh': 'تازہ',
  'search': 'تلاش',
  'send': 'بھیجنا',
  'yellow': 'پیلا',
  'gun': 'بندوق',
  'allow': 'اجازت',
  'print': 'پرنٹ',
  'dead': 'مردہ',
  'spot': 'جگہ',
  'desert': 'صحرا',
  'suit': 'سوٹ',
  'current': 'موجودہ',
  'lift': 'اٹھانا',
  'rose': 'گلاب',
  'continue': 'جاری',
  'block': 'بلاک',
  'chart': 'چارٹ',
  'hat': 'ٹوپی',
  'sell': 'بیچنا',
  'success': 'کامیابی',
  'company': 'کمپنی',
  'subtract': 'منہا',
  'event': 'واقعہ',
  'particular': 'خاص',
  'deal': 'معاملہ',
  'swim': 'تیرنا',
  'term': 'اصطلاح',
  'opposite': 'مخالف',
  'wife': 'بیوی',
  'shoe': 'جوتا',
  'shoulder': 'کندھا',
  'spread': 'پھیلانا',
  'arrange': 'ترتیب',
  'camp': 'کیمپ',
  'invent': 'ایجاد',
  'cotton': 'کپاس',
  'born': 'پیدا',
  'determine': 'طے',
  'quart': 'کوارٹ',
  'nine': 'نو',
  'truck': 'ٹرک',
  'noise': 'شور',
  'level': 'سطح',
  'chance': 'موقع',
  'gather': 'جمع',
  'shop': 'دکان',
  'stretch': 'کھینچنا',
  'throw': 'پھینکنا',
  'shine': 'چمک',
  'property': 'ملکیت',
  'column': 'کالم',
  'molecule': 'انو',
  'select': 'منتخب',
  'wrong': 'غلط',
  'gray': 'سرمئی',
  'repeat': 'دہرانا',
  'require': 'ضرورت',
  'broad': 'وسیع',
  'prepare': 'تیاری',
  'salt': 'نمک',
  'nose': 'ناک',
  'plural': 'جمع',
  'anger': 'غصہ',
  'claim': 'دعویٰ',
  'continent': 'براعظم'
};

// Helper function to calculate sentence importance score
function calculateSentenceScore(sentence: string, allSentences: string[]): number {
  const words = sentence.toLowerCase().split(/\s+/);
  let score = 0;
  
  // Word frequency scoring
  const wordFreq = allSentences.join(' ').toLowerCase().split(/\s+/).reduce((freq, word) => {
    freq[word] = (freq[word] || 0) + 1;
    return freq;
  }, {} as Record<string, number>);
  
  words.forEach(word => {
    if (word.length > 3 && wordFreq[word]) {
      score += Math.log(wordFreq[word] + 1);
    }
  });
  
  // Position scoring (earlier sentences are more important)
  const position = allSentences.indexOf(sentence);
  score += (allSentences.length - position) / allSentences.length * 10;
  
  // Length scoring (prefer moderate length sentences)
  const idealLength = 20;
  const lengthPenalty = Math.abs(words.length - idealLength) / idealLength;
  score -= lengthPenalty * 5;
  
  return score;
}

// Advanced summarization function
function generateSummary(text: string, targetSentences: number = 3): string {
  // Clean and split into sentences
  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/[.!?]+/)
    .filter(s => s.trim().length > 10)
    .map(s => s.trim());
  
  if (sentences.length <= targetSentences) {
    return sentences.join('. ') + '.';
  }
  
  // Score sentences
  const scoredSentences = sentences.map(sentence => ({
    text: sentence,
    score: calculateSentenceScore(sentence, sentences)
  }));
  
  // Select top sentences
  const topSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, targetSentences)
    .sort((a, b) => sentences.indexOf(a.text) - sentences.indexOf(b.text));
  
  return topSentences.map(s => s.text).join('. ') + '.';
}

// Translation function
function translateToUrdu(text: string): string {
  const words = text.split(/\s+/);
  const translatedWords = words.map(word => {
    const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
    return translationDict[cleanWord] || word;
  });
  
  return translatedWords.join(' ');
}

interface SummaryResponse {
  english: string;
  urdu: string;
  metadata: {
    title: string;
    wordCount: number;
    readingTime: string;
    source: string;
  };
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();
  const checkpoints: number[] = [];
  
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    // Validate URL
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    console.log('Processing URL:', url);
    
    // Check if URL already processed (caching)
    const existingSummary = await SupabaseService.checkUrlExists(url);
    if (existingSummary) {
      console.log('Returning cached summary for:', url);
      return NextResponse.json({
        english: existingSummary.summary,
        urdu: existingSummary.urdu_summary,
        metadata: {
          title: existingSummary.title,
          wordCount: existingSummary.word_count,
          readingTime: existingSummary.reading_time,
          source: existingSummary.source_domain
        },
        cached: true,
        processedAt: existingSummary.processed_at
      });
    }
    
    // Fetch and scrape content
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    checkpoints[0] = Date.now(); // Scraping completed
    
    // Extract title
    const title = $('title').text().trim() || 
                 $('h1').first().text().trim() || 
                 'Untitled Article';
    
    // Extract main content
    $('script, style, nav, header, footer, aside, .navigation, .sidebar, .menu').remove();
    
    const contentSelectors = [
      'article',
      '.post-content',
      '.entry-content', 
      '.content',
      'main',
      '.main-content',
      '.article-body',
      '.post-body'
    ];
    
    let content = '';
    let extractionMethod = 'body';
    for (const selector of contentSelectors) {
      const element = $(selector);
      if (element.length && element.text().trim().length > 200) {
        content = element.text().trim();
        extractionMethod = selector;
        break;
      }
    }
    
    // Fallback to body content
    if (!content) {
      content = $('body').text().trim();
      extractionMethod = 'body-fallback';
    }
    
    // Clean content
    content = content
      .replace(/\s+/g, ' ')
      .replace(/\n+/g, ' ')
      .trim();
    
    if (content.length < 100) {
      return NextResponse.json(
        { error: 'Unable to extract sufficient content from the URL' },
        { status: 400 }
      );
    }
    
    // Generate summary
    const summary = generateSummary(content, 3);
    checkpoints[1] = Date.now(); // Summarization completed
    
    // Translate to Urdu
    const urduSummary = translateToUrdu(summary);
    const processingStats = calculateProcessingStats(startTime, checkpoints);
    
    // Calculate metadata
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200) + ' min read';
    const sourceDomain = new URL(url).hostname;
    const contentHash = generateContentHash(content);
    const processedAt = new Date().toISOString();
    
    // Save to databases in parallel
    const savePromises = [
      // Save summary to Supabase
      SupabaseService.saveBlogSummary({
        url,
        title: title.substring(0, 100) + (title.length > 100 ? '...' : ''),
        summary,
        urdu_summary: urduSummary,
        word_count: wordCount,
        reading_time: readingTime,
        source_domain: sourceDomain,
        processed_at: processedAt,
        content_hash: contentHash
      }),
      
      // Save full content to MongoDB
      MongoService.saveBlogContent({
        url,
        title,
        full_content: content,
        metadata: {
          scraped_at: new Date(),
          word_count: wordCount,
          source_domain: sourceDomain,
          content_length: content.length,
          extraction_method: extractionMethod
        },
        processing_stats: processingStats
      })
    ];
    
    // Execute saves in parallel
    try {
      await Promise.all(savePromises);
      console.log('Successfully saved to both databases');
    } catch (dbError) {
      console.error('Database save error (non-blocking):', dbError);
      // Continue with response even if database save fails
    }
    
    const result = {
      english: summary,
      urdu: urduSummary,
      metadata: {
        title: title.substring(0, 100) + (title.length > 100 ? '...' : ''),
        wordCount,
        readingTime,
        source: sourceDomain
      },
      processing: {
        duration: Date.now() - startTime,
        steps: {
          scraping: processingStats.scrape_duration,
          summarization: processingStats.summary_duration,
          translation: processingStats.translation_duration
        }
      },
      cached: false,
      processedAt
    };
    
    // Log successful processing
    console.log('Successfully processed:', {
      url: sourceDomain,
      title: result.metadata.title,
      wordCount: result.metadata.wordCount,
      processingTime: result.processing.duration
    });
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Summarization error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Failed to process the blog URL',
        details: errorMessage,
        suggestion: 'Please try a different URL or check if the website is accessible',
        processingTime: Date.now() - startTime
      },
      { status: 500 }
    );
  }
} 