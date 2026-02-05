export interface BlogPost {
  id: string;
  slug: string;
  title: {
    ko: string;
    en: string;
  };
  description: {
    ko: string;
    en: string;
  };
  date: string;
  tags?: string[];
  content: {
    ko: string;
    en: string;
  };
}

export const blogPosts: BlogPost[] = [
  {
    id: "blog-3",
    slug: "financial-management-success",
    title: {
      ko: "현실푸어 대기업 회계사가 알려주는 재정관리의 성공법칙",
      en: "Financial Management Success: Lessons from a Big 4 Accountant"
    },
    description: {
      ko: "환경을 바꾸면 저축이 쉬워진다 - 60% 저축률 달성 비법",
      en: "How changing your environment makes saving easy - achieving 60%+ savings rate"
    },
    date: "2025-12-15",
    tags: ["Finance", "Personal Growth", "Career"],
    content: {
      ko: `# 현실푸어 대기업 회계사가 알려주는 재정관리의 성공법칙

인간은 변하기 어려워 -

사람이 변하려면 그에 맞는 환경을 만드는게 가장 중요해.

## 환경의 힘

1. **술을 끊고 싶다면** 술 좋아하는 친구들이랑 멀리해야하고, 일찍 자는 습관을 만들고 아침에 일찍 일어나는 생활을 하면 자연스럽게 술을 끊게 돼.
2. **담배를 끊고 싶다면** 담배 안 피는 친구들이랑 어울리고, 담배 피려면 너가 제일 싫어하는 행동이랑 엮으면 (예: 쓰레기 버리러 갈때만 담배를 핀다) 자연스럽게 담배도 줄이게 돼
3. **다이어트를 하고 싶다면** 집 안에 군것질을 다 없애고 헬창들이랑 어울리면 자연스럽게 다이어트도 하게 될꺼야.

## 나의 재정관리 실패와 성공

매년 나도 재정관리가 목표였는데 실패했던 이유는 내 의지를 너무 믿었고 환경을 조성을 못했어. 하지만 내 환경을 바꾸고 나서 어려움 없이 **매월 60% 이상 저축**하게 되었고 1-2년 후면 미국에서 10억대 집을 살수있을거 같아.

재정관리를 성공하고싶다면 너의 의지를 믿는게 아니라 **환경을 바꾸면** 너가 원하는 목표를 향해 달려갈수있어.

여기서 중요한건 **너의 목표**라는거야. 내 목표랑 너의 목표랑은 다를거야. 하지만 둘다 우리를 어제보다 더 나은 사람으로 만들어주는거야.

## 1. 재정 상태 파악

모든 문제의 시작은 너의 현재 상태를 파악하는게 가장 중요해.

**스스로에게 물어봐:**
- 한달에 얼마 벌어?
- 고정 지출이 얼마고 월급에 몇 프로야?
- 생활비는 한달에 얼마고 월급에 몇 프로야?
- 저축 금액은 얼마고 월급에 몇 프로야?
- 너의 현재 고정 지출 / 생활비 / 저축 금액 비율이 평균이야? 고수야? 파이어 족이야?

위 질문들을 대답할수있다면 너는 이미 반은 한거야. 하지만 너가 너의 현재 재정 상태를 모른다면 먼저 파악하는 것부터 시작해.

## 2. 목표 설정

그 다음은 너의 목표가 뭔지 설정하는게 중요해.

### 저축 플랜 설정하기

**중요한 점:**

제발 무리하지마. 너의 의지를 알겠지만 인간은 약하고 초반에 무리하면 실패할 확률이 높아.

**실천 방법:**
- 너가 하고 싶은 목표에서 3단계 정도 낮추고 설정해
- 너가 봤을때 "이건 껌이잖아?" 정도로 설정해
- 예를 들어 이번년도 50% 저축율을 설정하고 싶다면 30%로 낮춰

## 3. 환경 설정

이 목표를 이루려면 너의 의지말고 환경을 어떻게 바꿔야 하는지 적어봐.

나에게 가장 도움 된 방법들을 추천해줄께:

### A. 연인과 진지한 대화

여자친구 / 남자친구와 진지한 재정 대화를 해봐. 같이 플랜을 짜면서 이루고자 하는 미래를 계획해봐.

**팁:** 데이트 통장도 추천해

### B. 신용카드 해지 / 끊기

한달만 신용카드 끊고 체크카트로만 생활해봐 - 포인트 과감히 포기해. 그러면 돈이 모이는걸 자동으로 느껴질꺼야.

**실천 방법:**
- 지갑에서 신용카드 빼고 서랍에다 넣어놔
- Apple Wallet 에서 등록된 카드 지워
- 비상상황일때 어떡하냐고? 괜찮아. 큰일없어.

### C. 장부 관리

돈의 흐름을 맨날 체크하는 습관을 들여야 해.

**앱 추천:**
- **Rocket Money**: 무료 플랜 통해서 돈의 흐름을 볼수있어
- 수기로 할수있지만 힘들면 앱의 도움을 받아봐

**핵심 원칙:**
- 월급 들어오면 첫번째로 비상금 계좌 + 투자 계좌로 빼놓는게 가장 중요해
- 그리고 금액을 어디다가 적어둬

### D. 계좌 분류

계좌 하나로 모든 돈을 관리한다는건 진짜 어려운 일이야. 그러니 목적에 맞는 통장를 몇개 만들어.

**통장 설정 팁:**

**Zelle 설정:**
- Zelle 가입할때 핸드폰 번호 말고 이메일로 가입해
- 핸드폰 번호는 하나라서 너의 통장끼리 송금하기 어려울꺼야
- 이메일로 가입하면 너의 통장끼리 쉽게 송금할수있어

**통장 선택 기준:**
- Monthly Fee 없는 통장
- FDIC Insured 되는 온라인 통장

### 추천 통장

#### 1. 월급 통장: SoFi Bank

**장점:**
- Monthly Fee 없음
- Zelle 사용가능
- Direct Deposit 설정하면 월급 이틀 일찍 들어와
- 고이율: 현재 매월 3.8% 이자
- Vault 기능 (미니통장) 통해서 목적에 맞춰서 돈을 분류할수있어
  - 비상금 Vault 만들어서 비상금은 여기다가 넣어놔

**보너스:** Direct Deposit 설정하고 체킹 + 세이빙 통장 만들면 $325불 보너스

#### 2. 생활비 통장: Capital One

**장점:**
- Monthly Fee 없음
- Zelle 사용가능
- Target 가면 ATM 쓸수있어
- 체크카드 종류는 마스터카드

**보너스:** 500불 direct deposit 2회이상하면 250불 보너스

#### 3. 투자 통장: Robinhood

**장점:**
- 미국에서 제일 투자하기 쉬운 플랫폼
  - ETF + 개별주 + 코인 + 레버리지 상품 투자할수있어
- TurboTax 나 freetaxusa 랑 연동가능해서 세금 보고 하기 엄청 쉬어
- Gold (월 5불) 가입하면:
  - 잉여현금은 4% 이자율
  - 디파짓하면 Instant Deposit 통해서 바로 투자할수있어

## 결론

결국 인간은 환경의 영향을 가장 많이 받아. 재정 관리를 포함한 모든 변화는 단순한 결심이 아니라 **환경을 어떻게 세팅하느냐**에 달려 있어.

내가 매월 60% 이상 저축할 수 있었던 이유도 내 의지를 믿은 게 아니라, **돈을 아낄 수밖에 없는 환경을 만들었기 때문**이야.

그리고 지금 이 글을 읽고 있는 너도 환경을 바꾸기 시작하면, 원하는 목표에 훨씬 더 쉽게 다가갈 수 있을 거야.

**핵심은 네가 원하는 삶을 위한 환경을 설계하는 것!**

너의 목표를 명확히 하고, 그 목표를 이루기 쉬운 환경을 만들어봐. 그러면 자연스럽게 원하는 변화를 이뤄낼 수 있을 거야.`,
      en: `# Financial Management Success: Lessons from a Big 4 Accountant

Humans are hard to change -

The most important thing for people to change is to create the right environment.

## The Power of Environment

1. **If you want to quit drinking**: Distance yourself from friends who drink, develop a habit of sleeping early and waking up early, and you'll naturally quit drinking.
2. **If you want to quit smoking**: Hang out with non-smokers, and if you must smoke, pair it with an activity you hate (e.g., only smoke when taking out the trash), and you'll naturally reduce smoking.
3. **If you want to lose weight**: Remove all junk food from your home and hang out with fitness enthusiasts, and you'll naturally start dieting.

## My Financial Management Failure and Success

Every year, financial management was my goal, but I failed because I relied too much on my willpower and didn't create the right environment. However, after changing my environment, I easily started **saving over 60% every month**, and in 1-2 years, I'll be able to buy a million-dollar house in the US.

If you want to succeed in financial management, don't trust your willpower—**change your environment**, and you'll be able to run toward your desired goal.

What's important here is **your goal**. My goal and your goal will be different. But both will make us better people than we were yesterday.

## 1. Understand Your Financial State

The start of solving any problem is understanding your current state.

**Ask yourself:**
- How much do I earn per month?
- What are my fixed expenses and what percentage of my salary is that?
- What are my living expenses per month and what percentage of my salary is that?
- How much am I saving and what percentage of my salary is that?
- Is my current ratio of fixed expenses / living expenses / savings average? Advanced? FIRE-level?

If you can answer the above questions, you're already halfway there. But if you don't know your current financial state, start by figuring that out first.

## 2. Set Goals

Next, it's important to set what your goals are.

### Setting Up a Savings Plan

**Important point:**

Please don't overdo it. I understand your willpower, but humans are weak, and if you push too hard at the beginning, you're more likely to fail.

**Action steps:**
- Lower your desired goal by about 3 levels
- Set it to a level where you think "This is easy"
- For example, if you want to set a 50% savings rate this year, lower it to 30%

## 3. Environment Setup

Write down how you need to change your environment, not your willpower, to achieve this goal.

I'll recommend the methods that helped me the most:

### A. Serious Conversation with Your Partner

Have a serious financial conversation with your girlfriend/boyfriend. Plan the future you want to achieve together.

**Tip:** I also recommend a joint dating account

### B. Cancel / Cut Up Credit Cards

Try living with only a debit card for one month—boldly give up the points. Then you'll automatically feel your money accumulating.

**Action steps:**
- Take credit cards out of your wallet and put them in a drawer
- Delete registered cards from Apple Wallet
- What about emergencies? It's okay. Nothing major will happen.

### C. Expense Tracking

You need to develop a habit of checking your money flow every day.

**App recommendation:**
- **Rocket Money**: You can see your money flow through the free plan
- You can do it manually, but if it's difficult, get help from an app

**Core principle:**
- When your paycheck comes in, the first thing is to transfer to your emergency fund account + investment account
- And write down the amount somewhere

### D. Account Categorization

Managing all your money with one account is really difficult. So create several accounts for different purposes.

**Account setup tips:**

**Zelle setup:**
- When signing up for Zelle, use email instead of phone number
- You only have one phone number, so it'll be difficult to transfer between your accounts
- If you sign up with email, you can easily transfer between your accounts

**Account selection criteria:**
- Accounts with no monthly fee
- Online accounts that are FDIC insured

### Recommended Accounts

#### 1. Paycheck Account: SoFi Bank

**Benefits:**
- No monthly fee
- Zelle available
- If you set up Direct Deposit, your paycheck comes in two days early
- High interest rate: Currently 3.8% monthly interest
- Vault feature (mini accounts) allows you to categorize money by purpose
  - Create an emergency fund Vault and put your emergency fund there

**Bonus:** Set up Direct Deposit and create checking + savings accounts to get a $325 bonus

#### 2. Living Expenses Account: Capital One

**Benefits:**
- No monthly fee
- Zelle available
- Can use ATM at Target
- Debit card type is Mastercard

**Bonus:** Make 2 or more $500 direct deposits to get a $250 bonus

#### 3. Investment Account: Robinhood

**Benefits:**
- Easiest investment platform in the US
  - Can invest in ETFs + individual stocks + crypto + leveraged products
- Integrates with TurboTax or freetaxusa, making tax filing super easy
- If you subscribe to Gold ($5/month):
  - Surplus cash earns 4% interest
  - Instant Deposit allows you to invest immediately upon deposit

## Conclusion

Ultimately, humans are most influenced by their environment. All changes, including financial management, depend not on simple resolutions but on **how you set up your environment**.

The reason I could save over 60% every month wasn't because I trusted my willpower, but because **I created an environment where I had no choice but to save money**.

And if you, reading this now, start changing your environment, you'll be able to approach your desired goals much more easily.

**The key is designing an environment for the life you want!**

Clarify your goals and create an environment that makes achieving those goals easy. Then you'll naturally be able to achieve the changes you want.`
    }
  },
  {
    id: "blog-2",
    slug: "data-consulting-without-coding",
    title: {
      ko: "데이터 컨설팅, 코딩 못하면 힘들까?",
      en: "Can You Succeed in Data Consulting Without Coding?"
    },
    description: {
      ko: "데이터 컨설팅에서 코딩 능력보다 중요한 것들",
      en: "What matters more than coding skills in data consulting"
    },
    date: "2025-12-10",
    tags: ["Career", "Data Consulting", "Skills"],
    content: {
      ko: `# 데이터 컨설팅, 코딩 못하면 힘들까?

데이터 컨설팅을 하면 다들 코딩을 잘해야 할 것 같지만, 사실 꼭 그렇지는 않다. 데이터 컨설팅은 **Data Governance, Data Architecture, Data Visualization, AI/ML** 등 다양한 분야가 있어서, 코딩 능력만큼이나 **프로젝트 관리(Project Management), 클라이언트 커뮤니케이션(Client Communication)** 능력도 중요하게 본다.

## 데이터 컨설팅이란?

컨설팅의 핵심은 **클라이언트의 문제를 해결하는 것**이다. 프로젝트 성격도 다 다르다:

- **전략(Strategy)**: 기업이 어떤 방향으로 가야 하는지 컨설팅
- **엔터프라이즈 현대화(Enterprise Modernization)**: 기술을 최신화하는 프로젝트
- **데이터 거버넌스(Data Governance)**: 기존 시스템을 더 안전하고 효율적으로 운영
- **데이터 사일로 해결**: 분리된 데이터를 통합하는 작업

즉, 데이터 컨설팅에서 성공하려면 컴퓨터 공학(Computer Science) 전공이 필수는 아니다. 오히려 **데이터 개념과 아키텍처를 이해하는 능력**이 더 중요할 때도 많다.

## 코딩 없이 성공할 수 있을까?

데이터 컨설팅에서 코딩을 못 해도 성공할 수 있다. 다만, **커리어가 올라갈수록 역할이 변한다**는 점은 고려해야 한다.

- **매니저까지**: 프로젝트를 끝내는 능력 중요
- **시니어 매니저 이상**: 클라이언트에게 컨설팅을 '팔 수 있는' 능력 중요

특히 컨설팅 업계에서는 레벨이 높아질수록 세일즈(Sales) 역할이 커진다. 기술적인 부분은 보통 **오프쇼어 개발자들에게 맡긴다**. 즉, 개발을 잘한다고 해서 더 쉽게 승진하는 것은 아니다.

## 코딩 실력보다 중요한 것

데이터 컨설팅에서 중요한 것은 **패턴을 이해하고, 데이터 아키텍처를 파악하는 능력**이다.

### 핵심 역량

1. **비즈니스 이해력**
   - 데이터를 다룰 때 **어떤 구조가 효율적인지**
   - 클라이언트가 원하는 결과를 **어떤 방식으로 제공해야 하는지**
   - 문제를 해결하는 **비즈니스적인 사고방식**

2. **프로젝트 관리 능력**
   - 프로젝트를 성공적으로 완료하는 능력
   - 팀원들과의 협업 및 조율
   - 일정 관리와 리스크 관리

3. **클라이언트 커뮤니케이션**
   - 기술적인 내용을 비즈니스 언어로 번역
   - 클라이언트의 니즈를 정확히 파악
   - 신뢰 관계 구축

## 커리어 성장 경로

### 주니어 레벨 (Analyst - Consultant)
- 기술적 스킬이 더 중요
- 데이터 분석, 리포팅, 기본적인 코딩
- 프로젝트 실행 역할

### 미드 레벨 (Senior Consultant - Manager)
- 기술과 비즈니스의 균형
- 프로젝트 관리 시작
- 클라이언트 대면 증가

### 시니어 레벨 (Senior Manager - Partner)
- 비즈니스 개발이 핵심
- 세일즈 및 관계 관리
- 전략적 사고와 리더십

## 나의 경험

나는 원래 회계사로 입사했지만, 스스로 공부해서 더 기술적인 역할을 맡았다. 이유는 단순했다. **구조조정이 심하면 더 대체 불가능한 사람이 살아남기 때문**이다. 

하지만 꼭 테크니컬하지 않아도 컨설팅에서 잘 나가는 사람들은 많다. 중요한 건:

- **자신의 강점을 파악하고 활용하기**
- **부족한 부분은 팀원들과 협업으로 보완하기**
- **지속적인 학습 의지**

## 데이터 컨설팅 분야별 코딩 필요도

### 코딩이 덜 중요한 분야
- **Data Strategy**: 비즈니스 전략 수립
- **Data Governance**: 정책 및 프로세스 설계
- **Change Management**: 조직 변화 관리
- **Project Management**: 프로젝트 총괄 관리

### 코딩이 중요한 분야
- **Data Engineering**: 데이터 파이프라인 구축
- **AI/ML Implementation**: 모델 개발 및 배포
- **Advanced Analytics**: 복잡한 데이터 분석
- **Automation**: 프로세스 자동화

## 결론

**코딩을 못해도 데이터 컨설팅은 가능하다**. 

핵심은:
- 코딩이 필수가 아니라, **비즈니스와 기술의 연결을 이해하는 것**이 더 중요
- 자신의 강점을 살릴 수 있는 분야를 찾기
- 팀워크와 협업 능력 개발
- 지속적인 학습과 적응

고민하고 있다면, 겁먹지 말고 도전해 보자. 데이터 컨설팅은 다양한 배경과 스킬셋을 가진 사람들이 성공할 수 있는 분야다.`,
      en: `# Can You Succeed in Data Consulting Without Coding?

When people think of data consulting, they often assume you need to be an excellent coder. But that's not necessarily true. Data consulting encompasses diverse areas like **Data Governance, Data Architecture, Data Visualization, and AI/ML**, where **Project Management and Client Communication** skills are just as important as coding ability.

## What is Data Consulting?

The core of consulting is **solving client problems**. Projects vary widely in nature:

- **Strategy**: Advising companies on their direction
- **Enterprise Modernization**: Updating technology infrastructure
- **Data Governance**: Making existing systems safer and more efficient
- **Data Silo Resolution**: Integrating fragmented data

In other words, a Computer Science degree isn't essential for success in data consulting. Often, **understanding data concepts and architecture** is more important.

## Can You Succeed Without Coding?

Yes, you can succeed in data consulting without strong coding skills. However, **your role changes as you advance in your career**:

- **Up to Manager**: Ability to deliver projects is crucial
- **Senior Manager and Above**: Ability to 'sell' consulting to clients becomes key

In consulting, the higher you climb, the more sales-oriented your role becomes. Technical work is often **delegated to offshore developers**. Being a great developer doesn't automatically lead to faster promotion.

## What Matters More Than Coding

In data consulting, what's crucial is **understanding patterns and grasping data architecture**.

### Core Competencies

1. **Business Acumen**
   - **What structure is most efficient** when handling data
   - **How to deliver** the results clients want
   - **Business-oriented thinking** for problem-solving

2. **Project Management**
   - Successfully completing projects
   - Team collaboration and coordination
   - Schedule and risk management

3. **Client Communication**
   - Translating technical content into business language
   - Accurately understanding client needs
   - Building trust relationships

## Career Growth Path

### Junior Level (Analyst - Consultant)
- Technical skills are more important
- Data analysis, reporting, basic coding
- Project execution role

### Mid Level (Senior Consultant - Manager)
- Balance between technical and business
- Beginning project management
- Increased client interaction

### Senior Level (Senior Manager - Partner)
- Business development is core
- Sales and relationship management
- Strategic thinking and leadership

## My Experience

I originally joined as an accountant but taught myself to take on more technical roles. The reason was simple: **when restructuring happens, the irreplaceable people survive**.

However, many people succeed in consulting without being highly technical. What matters is:

- **Identifying and leveraging your strengths**
- **Compensating for weaknesses through team collaboration**
- **Commitment to continuous learning**

## Coding Requirements by Data Consulting Area

### Areas Where Coding is Less Critical
- **Data Strategy**: Business strategy development
- **Data Governance**: Policy and process design
- **Change Management**: Organizational change management
- **Project Management**: Overall project oversight

### Areas Where Coding is Important
- **Data Engineering**: Building data pipelines
- **AI/ML Implementation**: Model development and deployment
- **Advanced Analytics**: Complex data analysis
- **Automation**: Process automation

## Conclusion

**You can succeed in data consulting without coding skills**.

The key points:
- Coding isn't essential; **understanding the connection between business and technology** is more important
- Find areas where you can leverage your strengths
- Develop teamwork and collaboration skills
- Commit to continuous learning and adaptation

If you're considering this path, don't be intimidated—take the leap. Data consulting is a field where people with diverse backgrounds and skill sets can thrive.`
    }
  },
  {
    id: "blog-1",
    slug: "landing-big4-internship-guide",
    title: {
      ko: "[유학생의 미국 대기업 취업 가이드]",
      en: "[The International Student's Guide to Landing a Big 4 Internship]"
    },
    description: {
      ko: "유학생으로서 대기업 인턴십을 따내는 실전 가이드",
      en: "A practical guide for international students to secure competitive internships"
    },
    date: "2025-12-01",
    tags: ["Career", "Internship"],
    content: {
      ko: `# 유학생의 미국 대기업 취업 가이드

안녕하세요 -

저는 2019년 5월에 Big 4 회계법인에서 정규직으로 시작했습니다.

2015년에 대학교에 처음 입학해서 유학원 도움 없이 혼자 취업 플랜을 짜고 회계학과로써 갈 수 있는 최고의 회사 중 하나에 입사했습니다.

대학교 다닐 때 누군가 저한테 이 글을 보여줬더라면 너무나 고마웠을 텐데! 하지만 더 감사한 건 제가 이 글을 필요한 사람들에게 도움이 될 수 있다는 거예요.

시작하기에 앞서 "나는 회계학과가 아니고 회사마다 뽑는 기준이 다른데 이 글이 도움이 될까?" 라고 생각할 수도 있지만 신입사원이나 인턴 뽑을 때 보는 기준이 비슷한 것 같아요. 그리고 제가 수많은 유학생들 이력서 수정과 면접을 도와주었기 때문에 이 글이 도움이 되는 건 확실합니다.

## 핵심 요약

1. **1학년, 2학년이 가장 중요합니다**
2. **포트폴리오 프로젝트가 차별화 요소입니다**
3. **비즈니스 가치를 증명할 수 있어야 합니다**

## 오늘날의 취업 시장

2024-2026년 취업 시장은 그 어느 때보다 경쟁이 치열합니다. 단순히 좋은 학점과 클럽 활동만으로는 부족합니다. 회사들은 이제 **실제로 회사에 기여할 수 있는 능력**을 증명할 수 있는 지원자를 찾고 있습니다.

이것이 의미하는 바:
- **매출 증대**: 당신의 스킬이 어떻게 회사의 수익을 늘릴 수 있는가?
- **비용 절감**: 당신이 어떻게 프로세스를 효율화하고 비용을 줄일 수 있는가?
- **실제 증명**: 포트폴리오 프로젝트로 이를 보여줄 수 있는가?

## 미국 대학 학기 스케줄

미국 학교는 가을(8-9월) 학기가 시작되고 봄(4-5월)에 마무리됩니다.

겨울 방학은 아주 짧고, 반대로 여름 방학은 되게 길어요 - 여기서 알아야 하는 점은 **여름 인턴십 기회가 엄청 많다**는 것입니다.

## 취업 성공 정석 코스

**1학년** → 
- 여름 → Externship (Optional) + **첫 포트폴리오 프로젝트 시작**

**2학년** →
- 여름 → Externship + **포트폴리오 프로젝트 완성**
  - Externship: 1-2주 맛보기 프로그램. 잘하면 인턴십 기회가 주어짐

**3학년** →
- 여름 → Internship + **고급 프로젝트로 전문성 증명**
  - Internship: 2-3개월 인턴. 잘하면 풀타임 주어짐

**4학년** →
- 여름 → Full-time
  - Full-time: 졸업하고 신입사원으로 회사 입사

### 왜 일찍 시작해야 할까?

큰 회사일수록 그 회사에 알맞은 직원들을 채용하기 위해 양육 프로그램이 존재합니다.

회사 입장에서는 신입사원을 뽑아서 적응시키고 가르치고 투자시키는 리스크와 코스트를 지는 것보다 externship, internship으로 뽑아서 다 가르치고 회사에 데려오는 게 훨씬 이득입니다.

**중요한 타이밍:**
- 2/3학년 여름 externship 지원 마감: **2학년 1학기**
- 3/4학년 여름 internship 지원 마감: **3학년 1학기**

그러면 언제 가장 신경 써야 될 시기일까요?

**정답은 1학년 2학년입니다.**

대부분 유학생들이 취업 못하는 이유는 1-2학년 때 적응하느라 성적을 잘 못 받고 3학년 때부터 정신 차리고 올리려고 하는데 그때면 이미 정석 코스와 멀어져 있고 졸업에 가까워져서 취업하기가 정말 어렵습니다.

## 회사가 보는 다섯 가지

### 1. 학점 (GPA)

**3.5 이상:**
- 이 내신은 출석, 숙제, 시험 전부 다 잘하지 않는 이상 받기 어려운 내신이어서 회사 입장에서는 지원자를 열심히 함, 시간 관리 잘함, 머리 좋음으로 인식

**3.0 - 3.5:**
- 이 내신은 미안한데 대기업 입장에선 경쟁력 있지 않아요. 학점이 여기라면 다른 곳에서 커버를 해줘야 해요

**3.0 아래:**
- 이 내신은 더 힘들어요. 많은 회사들이 최소 학점을 3.0으로 둡니다

### 2. 클럽 활동

**클럽 임원직 (회장, 부회장, 서기, 총무, 후원 담당):**
- 지원자가 학점 관리 외에 클럽 임원직을 맡으며 멤버들 관리와 이벤트 짜고 멤버들과 있는 트러블 잘 해결함 - 지원자가 리더십 있고 문제 해결 능력이 좋음

**클럽 멤버:**
- 미안한데 멤버로서는 조금 약해요. 무조건 임원직으로 노려보길 추천할게요

### 3. 일 경험

일 경험은 유학생들 사이에서 가장 안 하고 이력서에 못 채우는 부분이에요. F-1 비자 학생으로써 학교 내에 알바는 합법이에요. 캐시 잡에 혹해서 불법으로 일하면 이력서에도 못 쓰니까 꼭 학교 내에 일자리를 구하세요.

**알바를 하면:**
- 영어도 많이 늘고 나중에 좋은 인맥도 많이 쌓아요
- 일자리 에티켓, 미국 일 문화를 배워요
- 스토리가 많이 생겨서 나중에 면접 때 할 얘기가 많아져요

### 4. 포트폴리오 프로젝트 (가장 중요!)

**이것이 게임 체인저입니다.**

오늘날 취업 시장에서 포트폴리오 프로젝트는 선택이 아니라 **필수**입니다. 

**왜 중요한가?**
- 수백 명의 지원자가 비슷한 학점과 클럽 활동을 가지고 있어요
- 포트폴리오는 당신이 **실제로 무엇을 할 수 있는지** 보여줍니다
- 면접관들은 구체적인 프로젝트 경험에 대해 질문하기를 좋아합니다

**좋은 포트폴리오 프로젝트란?**

1. **비즈니스 문제 해결**
   - "회사 X의 Y 문제를 Z 방법으로 해결했습니다"
   - 예: "이커머스 회사의 장바구니 이탈률을 15% 감소시킨 A/B 테스트 분석"

2. **측정 가능한 결과**
   - "매출 20% 증가"
   - "처리 시간 30% 단축"
   - "비용 $50,000 절감"

3. **실제 기술 스택 사용**
   - 회사에서 실제로 사용하는 도구와 기술
   - Python, SQL, Tableau, Power BI, Excel 등

**프로젝트 아이디어:**

**회계/재무 전공:**
- 재무 모델링 대시보드 (Excel/Power BI)
- 비용 최적화 분석
- 예산 예측 모델

**데이터/분석 전공:**
- 고객 이탈 예측 모델
- 매출 예측 대시보드
- 프로세스 자동화 스크립트

**비즈니스/마케팅 전공:**
- 마케팅 캠페인 ROI 분석
- 고객 세그먼테이션 분석
- 경쟁사 분석 대시보드

### 5. 비즈니스 가치 증명 능력

면접에서 이렇게 말할 수 있어야 합니다:

"제 프로젝트에서 저는 [구체적인 기술]을 사용해서 [비즈니스 문제]를 해결했고, 그 결과 [측정 가능한 결과]를 달성했습니다. 이 경험을 통해 귀사의 [특정 부서/프로젝트]에서 [구체적인 기여]를 할 수 있습니다."

**예시:**
"Python과 SQL을 사용해서 재고 관리 프로세스를 자동화했고, 그 결과 처리 시간을 40% 단축했습니다. 이 경험을 통해 귀사의 감사 팀에서 데이터 분석 효율성을 높이는 데 기여할 수 있습니다."

## 인턴십 vs 풀타임

인턴십 오퍼 받는 확률은 60-70% 사이고 그중에서 50%는 정규직으로 전환이 돼요. 반대로 정규직 오퍼는 45%예요. 

**유학생은 무조건 인턴십 딸 생각해야 해요.**

### 중요한 점

1. 가뜩이나 유학생들을 스폰 해주는 회사도 많이 없어서 앞서 말한 수치보다 합격률이 낮을 텐데 인턴십으로 지원하는 게 더 유리해요
2. 인턴십하고 나서 정규직 오퍼를 4학년 들어가기 전에 따내면 4학년 여유 있게 다니면서 OPT 비자 준비할 수 있어요
3. 정규직 오퍼를 못 받는다 해도 인턴 경력으로 다른 회사 지원할 때 이력서에 엄청 도움 돼요
4. 인턴을 통해서 너랑 회사랑 맞는지 확인할 수 있는 기회예요
5. 회사에서 인턴들한테는 투자한 돈이 있기 때문에 더욱더 안 놓치려고 할 거예요

## 면접 준비

### 기본은 하자

1. 카메라는 무조건 eye level
2. Formal attire
3. 조용한 방
4. 목소리 잘 들려야 돼요
5. 깔끔한 배경 (흰 벽 추천)
6. 바디 랭귀지: 인터뷰어의 눈을 쳐다보면서 듣고 말하고, 많이 웃고, 몸은 앞으로 기울기

### 포트폴리오 프로젝트 설명 준비

**STAR 방법 사용:**
- **S**ituation: 어떤 문제가 있었나?
- **T**ask: 당신의 역할은?
- **A**ction: 무엇을 했나?
- **R**esult: 결과는? (숫자로!)

### 중요한 마인드셋

1. **겸손해라**: 모르면 모른다고 말하는 게 괜찮아요
2. **도움을 구해라**: 간절하게 배움을 구하는 사람의 요청을 거절하기는 어려워요
3. **자신감을 가져라**: 최종 인터뷰까지 온 거는 이미 너가 수백 명의 경쟁자 중에서 뽑힌 거예요

---

**당신도 할 수 있어요!**

핵심은 일찍 시작하고, 포트폴리오를 만들고, 비즈니스 가치를 증명하는 것입니다.`,
      en: `# The International Student's Guide to Landing a Big 4 Internship

Hello -

I started my full-time position at a Big 4 accounting firm in May 2019.

I first enrolled in college in 2015, planned my career path independently without any consulting agency, and landed a position at one of the best companies an accounting major could aim for.

I wish someone had shown me this guide when I was in college! But what I'm even more grateful for is that I can now help others who need this information.

Before we start, you might think "I'm not an accounting major and every company has different hiring criteria - will this really help me?" But I believe the criteria for hiring entry-level employees and interns are quite similar across companies. And I'm confident this will help because I've assisted countless international students with resume editing and interview preparation.

## Key Takeaways

1. **Freshman and sophomore years are the most important**
2. **Portfolio projects are your differentiator**
3. **You must prove business value**

## Today's Job Market Reality

The 2024-2026 job market is more competitive than ever. Simply having good grades and club activities is no longer enough. Companies are now looking for candidates who can **prove they can actually contribute to the company's bottom line**.

What this means:
- **Increase Revenue**: How can your skills help the company make more money?
- **Decrease Costs**: How can you streamline processes and reduce expenses?
- **Show Proof**: Can you demonstrate this through portfolio projects?

## Understanding the U.S. College Semester Schedule

U.S. schools start in the fall (August-September) and end in spring (April-May).

Winter break is very short, while summer break is quite long - the key point here is that **there are tons of summer internship opportunities**.

## The Standard Path to Success

**Freshman Year** → 
- Summer → Externship (Optional) + **Start your first portfolio project**

**Sophomore Year** →
- Summer → Externship + **Complete portfolio projects**
  - Externship: 1-2 week trial program. If you do well, you get an internship opportunity

**Junior Year** →
- Summer → Internship + **Advanced projects to prove expertise**
  - Internship: 2-3 month intern position. If you do well, you get a full-time offer

**Senior Year** →
- Summer → Full-time
  - Full-time: Start as a new employee after graduation

### Why Start Early?

The bigger the company, the more likely they have a development program to cultivate employees who fit their culture.

From the company's perspective, it's much more beneficial to recruit through externships and internships, train candidates, and then bring them into the company, rather than hiring new employees and bearing the risk and cost of adapting, training, and investing in them.

**Critical Timelines:**
- Sophomore/Junior summer externship application deadline: **First semester of sophomore year**
- Junior/Senior summer internship application deadline: **First semester of junior year**

So when should you be most careful?

**The answer is freshman and sophomore years.**

Most international students fail to get jobs because they struggle to adapt during freshman and sophomore years and don't get good grades, then try to recover starting junior year. But by then, they're already off the standard track and close to graduation, making it really difficult to get hired.

## The Five Things Companies Look For

### 1. GPA

**3.5 and above:**
- This GPA is hard to achieve unless you excel at attendance, homework, and exams, so companies perceive the candidate as hardworking, good at time management, and intelligent

**3.0 - 3.5:**
- Sorry, but this GPA isn't competitive for large companies. If your GPA is here, you need to compensate in other areas

**Below 3.0:**
- This is even harder. Many companies set the minimum GPA at 3.0

### 2. Club Activities

**Club Officer Positions (President, Vice President, Secretary, Treasurer, Sponsorship):**
- Shows that in addition to managing academics, the candidate took on officer responsibilities, managed members, organized events, and resolved member conflicts - demonstrates leadership and problem-solving skills

**Club Member:**
- Sorry, but just being a member is a bit weak. I strongly recommend aiming for an officer position

### 3. Work Experience

Work experience is the part that international students most often skip and can't fill on their resumes. As an F-1 visa student, on-campus jobs are legal. Don't be tempted by cash jobs and work illegally because you won't be able to put it on your resume. Make sure to find on-campus employment.

**Benefits of part-time jobs:**
- Your English improves a lot and you build good connections
- You learn workplace etiquette and American work culture
- You create many stories that you can talk about in interviews later

### 4. Portfolio Projects (MOST IMPORTANT!)

**This is the game changer.**

In today's job market, portfolio projects are not optional - they're **essential**.

**Why are they critical?**
- Hundreds of applicants have similar GPAs and club activities
- Portfolio projects show what you can **actually do**
- Interviewers love asking about concrete project experience

**What makes a good portfolio project?**

1. **Solves a Business Problem**
   - "I solved problem Y for company X using method Z"
   - Example: "Reduced cart abandonment rate by 15% through A/B testing analysis for an e-commerce company"

2. **Measurable Results**
   - "Increased revenue by 20%"
   - "Reduced processing time by 30%"
   - "Saved $50,000 in costs"

3. **Uses Real Tech Stack**
   - Tools and technologies actually used in companies
   - Python, SQL, Tableau, Power BI, Excel, etc.

**Project Ideas:**

**Accounting/Finance Majors:**
- Financial modeling dashboard (Excel/Power BI)
- Cost optimization analysis
- Budget forecasting model

**Data/Analytics Majors:**
- Customer churn prediction model
- Revenue forecasting dashboard
- Process automation scripts

**Business/Marketing Majors:**
- Marketing campaign ROI analysis
- Customer segmentation analysis
- Competitive analysis dashboard

### 5. Ability to Demonstrate Business Value

In interviews, you should be able to say:

"In my project, I used [specific technology] to solve [business problem], and achieved [measurable result]. Through this experience, I can contribute to your [specific department/project] by [specific contribution]."

**Example:**
"I used Python and SQL to automate the inventory management process, reducing processing time by 40%. Through this experience, I can contribute to your audit team by improving data analysis efficiency."

## Internship vs Full-Time

The chance of getting an internship offer is between 60-70%, and 50% of those convert to full-time. In contrast, the full-time offer rate is 45%.

**International students should definitely aim for internships.**

### Important Points

1. There aren't many companies that sponsor international students, so the acceptance rate is lower than the numbers mentioned above, but applying for internships is more advantageous
2. If you get a full-time offer after your internship before starting senior year, you can enjoy senior year while preparing your OPT visa
3. Even if you don't get a full-time offer, the internship experience greatly helps your resume when applying to other companies
4. Internships are an opportunity to see if you and the company are a good fit
5. Companies have invested money in interns, so they'll try even harder not to lose you

## Interview Preparation

### The Basics

1. Camera must be at eye level
2. Formal attire
3. Quiet room
4. Voice must be clear
5. Clean background (white wall recommended)
6. Body language: Look into the interviewer's eyes while listening and speaking, smile a lot, lean forward

### Prepare to Explain Portfolio Projects

**Use the STAR Method:**
- **S**ituation: What was the problem?
- **T**ask: What was your role?
- **A**ction: What did you do?
- **R**esult: What was the outcome? (Use numbers!)

### Important Mindset

1. **Be humble**: It's okay to say you don't know
2. **Ask for help**: It's hard to refuse a request from someone earnestly seeking to learn
3. **Be confident**: Making it to the final interview means you've already been selected from hundreds of competitors

---

**You can do it too!**

The key is to start early, build your portfolio, and prove your business value.`
    }
  }
];
