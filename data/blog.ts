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
    date: "2024-01-15",
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
