// Income level plan data
export const LEVEL_DATA = [
  { level: 1, members: 50,    sponsors: 1,  payout: 1500,   payoutStr: '₹1,500' },
  { level: 2, members: 200,   sponsors: 2,  payout: 5000,   payoutStr: '₹5,000' },
  { level: 3, members: 500,   sponsors: 3,  payout: 7000,   payoutStr: '₹7,000' },
  { level: 4, members: 1000,  sponsors: 5,  payout: 10000,  payoutStr: '₹10,000' },
  { level: 5, members: 3000,  sponsors: 7,  payout: 20000,  payoutStr: '₹20,000' },
  { level: 6, members: 6000,  sponsors: 10, payout: 40000,  payoutStr: '₹40,000' },
  { level: 7, members: 9000,  sponsors: 20, payout: 60000,  payoutStr: '₹60,000' },
  { level: 8, members: 12000, sponsors: 30, payout: 100000, payoutStr: '₹1,00,000' },
  { level: 9, members: 15000, sponsors: 40, payout: 200000, payoutStr: '₹2,00,000' },
];

// Total potential earnings
export const TOTAL_POTENTIAL = LEVEL_DATA.reduce((sum, l) => sum + l.payout, 0);

// FAQ data
export const FAQ_DATA = [
  {
    q: 'What is RS Trading?',
    a: 'RS Trading is a premium digital business network platform that allows members to earn income through a structured multi-level referral system. Members earn commissions based on their network size and activity levels.',
  },
  {
    q: 'How do I register on RS Trading?',
    a: 'Registration is simple. You need a valid Sponsor ID from an existing member, your personal details, address, and banking information. After submitting the form, you\'ll receive your unique RS Trading ID instantly.',
  },
  {
    q: 'What is an E-Pin and why do I need it?',
    a: 'An E-Pin (Electronic Pin) is a unique activation code required to activate your RS Trading account. Without account activation, you cannot earn income or participate in the business plan. E-Pins can be obtained from your sponsor or purchased through official channels.',
  },
  {
    q: 'When and how do I get paid?',
    a: 'Income is credited to your RS Trading wallet automatically as per the plan rules. Withdrawals are processed every Monday and Thursday. Funds are transferred directly to your registered bank account within 2–3 business days.',
  },
  {
    q: 'How do withdrawals work?',
    a: 'Once you have a minimum balance of ₹500 in your wallet, you can request a withdrawal. Submit your request through the Wallet section of your dashboard. Our finance team reviews and processes withdrawals twice a week.',
  },
  {
    q: 'Is RS Trading legal and compliant?',
    a: 'Yes, RS Trading operates within the legal framework of India. All transactions are tracked, and members are required to submit PAN card details for KYC verification. The platform follows a legitimate referral income model.',
  },
  {
    q: 'What is the account activation amount?',
    a: 'Account activation requires a valid E-Pin. The E-Pin value corresponds to the activation fee for joining the RS Trading business plan. Contact your sponsor or support team for current E-Pin pricing.',
  },
  {
    q: 'How do I build my team effectively?',
    a: 'Use your unique referral link from your dashboard to invite people. Share it on WhatsApp, Telegram, and social media. The more active members you bring in, the faster you progress through income levels. Use the Referral and Team Network sections to track your growth.',
  },
];

// Testimonials
export const TESTIMONIALS = [
  {
    name: 'Rahul Sharma',
    city: 'Mumbai, Maharashtra',
    initials: 'RS',
    rating: 5,
    text: 'RS Trading has completely changed my financial situation. Within 6 months, I\'ve built a strong team and started earning a consistent income. The dashboard is incredibly easy to use.',
  },
  {
    name: 'Priya Patel',
    city: 'Ahmedabad, Gujarat',
    initials: 'PP',
    rating: 5,
    text: 'I was skeptical at first, but the transparent income system and real-time dashboard convinced me. I\'ve reached Level 3 in just 4 months. The support team is always available.',
  },
  {
    name: 'Amit Kumar',
    city: 'Patna, Bihar',
    initials: 'AK',
    rating: 5,
    text: 'What I love most about RS Trading is the clarity. You know exactly what you need to do to reach the next level. No hidden rules, no confusion. Pure business.',
  },
];

// Trust features
export const TRUST_FEATURES = [
  {
    icon: 'Shield',
    title: 'Secure Payments with PAN Verification',
    desc: 'All withdrawals are verified against your KYC documents. Your money is always safe.',
  },
  {
    icon: 'Eye',
    title: 'Transparent Withdrawals',
    desc: 'Every transaction is logged with timestamps. View your complete income history anytime.',
  },
  {
    icon: 'Scale',
    title: 'Legal & Compliant Business',
    desc: 'RS Trading operates within Indian law. PAN-verified members, TDS compliance, audit trails.',
  },
  {
    icon: 'Headphones',
    title: 'Dedicated Support Team',
    desc: 'Our support team is available 7 days a week via tickets, WhatsApp, and email.',
  },
];

// How It Works steps
export const HOW_IT_WORKS = [
  {
    step: 1,
    icon: 'UserPlus',
    title: 'Register & Activate',
    desc: 'Sign up with your sponsor\'s ID and activate your account with an E-Pin to unlock all earning features.',
  },
  {
    step: 2,
    icon: 'Share2',
    title: 'Share Your Link',
    desc: 'Get your unique referral link from your dashboard and share it with people in your network.',
  },
  {
    step: 3,
    icon: 'Users',
    title: 'Build Your Team',
    desc: 'As your referrals join and activate, your team grows. Watch your network expand across all 9 levels.',
  },
  {
    step: 4,
    icon: 'TrendingUp',
    title: 'Earn Income',
    desc: 'Earn direct and level income automatically as your team grows. Withdraw to your bank anytime.',
  },
];

// Districts of Maharashtra (sample)
export const DISTRICTS = [
  'Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara',
  'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli',
  'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban',
  'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar',
  'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara',
  'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'
];

// Nominee relations
export const NOMINEE_RELATIONS = ['Spouse', 'Parent', 'Sibling', 'Child', 'Other'];

// Bank names (common Indian banks)
export const BANK_NAMES = [
  'State Bank of India', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank',
  'Union Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank',
  'Yes Bank', 'IndusInd Bank', 'IDFC First Bank', 'Federal Bank', 'South Indian Bank',
  'Karur Vysya Bank', 'Bank of India', 'Central Bank of India', 'Indian Bank',
  'UCO Bank', 'Bank of Maharashtra'
];
