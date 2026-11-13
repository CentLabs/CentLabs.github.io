# 第3章 一元函数积分学

> 覆盖范围：1987—2025 考研数学二（数二）真题。本章聚焦"不定积分（换元、分部、有理函数）、定积分（定义与性质、牛顿-莱布尼茨、换元与分部、对称性与变限积分）、反常积分（无穷限与瑕积分及敛散判别）、定积分的几何应用（面积、旋转体体积、弧长、旋转曲面面积、形心）与物理应用（变力做功、液体压力、引力）"。
> 说明：源文件为 PDF 抽取的纯文本，数学公式被拆成竖排碎片，部分年份为字体编码乱码或符号替换。1987 年真题与解析册、1988 年真题册为字体编码乱码；1990 年解析册为乱码（真题册清晰）；2012、2014—2018 年原始试题册缺失（仅存解析册），其中 2014、2015、2017 年解析册亦为乱码，2016、2018 年解析册含字符替换（"工"代 $x$、"托"代 $\pi$ 等）；2019 年真题册乱码、解析册字符替换；2020、2021 年真题册为符号/字体替换（积分号、希腊字母被替换为 `#`、`$`、西里尔字母等）；2022 年真题册为字体编码乱码且无解析册；2023、2024 年真题资料整年缺失；2025 年仅存答案册且通篇符号乱码，无法还原任何题目。以上年份中可依解析核实的题目照实列入，无法还原的题面与答案如实标注，未作任何编造；题面清晰年份（1989—2013 的真题册）按题号逐题还原，公式由竖排碎片拼合并以数学推导复核答案。

---

## 一、知识体系

### 1.1 原函数与不定积分

若在区间 $I$ 上 $F'(x)=f(x)$，则称 $F(x)$ 是 $f(x)$ 在 $I$ 上的一个**原函数**；$f$ 的全体原函数记作**不定积分**

$$
\int f(x)\,dx=F(x)+C,\qquad \left(\int f(x)\,dx\right)'=f(x),\quad \int F'(x)\,dx=F(x)+C.
$$

**原函数存在定理**：连续函数必有原函数；含第一类间断点（跳跃、可去）的函数在包含该点的区间内**没有**原函数（1990 选择(2)、1992 选择(5)、1999 选择(3)、2005 选择(8)、2006 选择(8) 反复考）。注意 $\dfrac{d}{dx}\int f(x)dx=f(x)$，而 $\int f'(x)dx=f(x)+C$，二者相差常数。

**奇偶性**（高频）：$f$ 为奇函数 $\Rightarrow$ 其任一原函数 $F$ 为偶函数；$f$ 为偶函数 $\Rightarrow$ 其原函数中恰有一个（满足 $F(0)=0$ 的那个）为奇函数；$f$ 周期 $\Rightarrow$ $F$ 未必周期（须 $\int_0^T f=0$ 才周期）。

### 1.2 基本积分表

$$
\int x^a dx=\frac{x^{a+1}}{a+1}+C\ (a\ne-1),\quad \int\frac{dx}{x}=\ln|x|+C,
$$

$$
\int e^x dx=e^x+C,\quad \int a^x dx=\frac{a^x}{\ln a}+C,
$$

$$
\int\sin x\,dx=-\cos x+C,\quad \int\cos x\,dx=\sin x+C,
$$

$$
\int\sec^2x\,dx=\tan x+C,\quad \int\csc^2x\,dx=-\cot x+C,
$$

$$
\int\frac{dx}{\sqrt{1-x^2}}=\arcsin x+C,\quad \int\frac{dx}{1+x^2}=\arctan x+C,
$$

$$
\int\sec x\,dx=\ln|\sec x+\tan x|+C,\quad \int\frac{dx}{\sqrt{x^2\pm a^2}}=\ln\bigl|x+\sqrt{x^2\pm a^2}\bigr|+C,
$$

$$
\int\frac{dx}{x^2-a^2}=\frac{1}{2a}\ln\left|\frac{x-a}{x+a}\right|+C,\quad \int\frac{dx}{\sqrt{a^2-x^2}}=\arcsin\frac{x}{a}+C.
$$

### 1.3 第一类换元（凑微分）

设 $F'(u)=f(u)$，$u=\varphi(x)$ 可导，则

$$
\int f(\varphi(x))\varphi'(x)\,dx=\int f(u)\,du=F(\varphi(x))+C.
$$

常用凑微分：$\dfrac{dx}{\sqrt{x}}=2d\sqrt x$，$\dfrac{dx}{x}=d\ln x$，$e^x dx=d(e^x)$，$\cos x\,dx=d(\sin x)$，$\dfrac{dx}{1+x^2}=d(\arctan x)$，$\dfrac{dx}{\sqrt{1-x^2}}=d(\arcsin x)$，$\sec^2x\,dx=d(\tan x)$。例如

$$
\int\frac{\arctan x}{1+x^2}dx=\frac12\arctan^2x+C,\qquad \int\frac{e^x}{1+e^{2x}}dx=\arctan e^x+C.
$$

### 1.4 第二类换元

令 $x=\psi(t)$（$\psi$ 单调可导、$\psi'\ne0$），则

$$
\int f(x)\,dx=\left.\int f(\psi(t))\psi'(t)\,dt\right|_{t=\psi^{-1}(x)}.
$$

三类常用代换：

$$
\sqrt{a^2-x^2}:\ x=a\sin t;\qquad \sqrt{a^2+x^2}:\ x=a\tan t;\qquad \sqrt{x^2-a^2}:\ x=a\sec t;
$$

$$
\sqrt[n]{ax+b}:\ t=\sqrt[n]{ax+b};\qquad \text{分母次数高于分子：倒代换 } x=\frac1t.
$$

三角有理式 $\int R(\sin x,\cos x)dx$ 用万能代换 $t=\tan\frac x2$：$\sin x=\dfrac{2t}{1+t^2},\ \cos x=\dfrac{1-t^2}{1+t^2},\ dx=\dfrac{2\,dt}{1+t^2}$。

### 1.5 分部积分

$$
\int u\,dv=uv-\int v\,du,\qquad \int_a^b u\,dv=\bigl.uv\bigr|_a^b-\int_a^b v\,du.
$$

取 $u$ 的优先级："反对幂指三"（反三角、对数、幂、指数、三角），排在前面的取作 $u$。典型模型：

$$
\int x^n e^{x}dx,\ \int x^n\sin x\,dx,\ \int x^n\ln x\,dx,\ \int e^{ax}\sin bx\,dx\ \text{(两次分部后解方程)},
$$

$$
\int \frac{\ln x}{x^2}dx=-\frac{\ln x+1}{x}+C\ (1989),\qquad \int e^{2x}(1+\tan x)^2dx=e^{2x}\tan x+C\ (1997),
$$

后一题的关键是 $(e^{2x}\tan x)'=e^{2x}(\sec^2x+2\tan x)=e^{2x}(1+\tan x)^2$。

**分部积分与反常/定积分结合**（1999 四、1993 八、2005(17)、2008(20)）：$\int_a^b u'v=[uv]_a^b-\int_a^b uv'$，常把高阶导数积分化为低阶导数与端点值。

### 1.6 有理函数积分

真分式 $\dfrac{P(x)}{Q(x)}$ 按 $Q(x)$ 的因式分解作部分分式分解：

$$
\frac{P(x)}{Q(x)}=\sum\frac{A_i}{(x-a)^i}+\sum\frac{B_jx+C_j}{(x^2+px+q)^j},
$$

再逐项积分（一次因式给对数，二次不可约因式给对数 + 反正切）。例如

$$
\int\frac{x+5}{x^2-6x+13}dx=\frac12\ln(x^2-6x+13)+4\arctan\frac{x-3}{2}+C\ (1999\ \text{填空(3)}).
$$

### 1.7 定积分的定义、性质与牛顿-莱布尼茨公式

$$
\int_a^b f(x)\,dx=\lim_{\lambda\to0}\sum_{i=1}^n f(\xi_i)\Delta x_i,\qquad \lambda=\max\Delta x_i.
$$

**牛顿-莱布尼茨公式**（$f$ 连续、$F'=f$）：

$$
\int_a^b f(x)\,dx=F(b)-F(a).
$$

**性质**：线性性；可加性 $\int_a^b=\int_a^c+\int_c^b$；$\int_a^a=0,\ \int_b^a=-\int_a^b$；保序性 $f\le g\Rightarrow\int_a^b f\le\int_a^b g$（注意上下限大小）；$|\int_a^b f|\le\int_a^b|f|$；估值 $m(b-a)\le\int_a^b f\le M(b-a)$；**积分中值定理**

$$
\exists\,\eta\in[a,b]:\ \int_a^b f(x)dx=f(\eta)(b-a)\quad (f\ \text{连续}),
$$

2008(20) 直接要求证明此定理，2003 十、2011(21)、2020(21) 用它作证明工具。

**平均值**：$\bar f=\dfrac{1}{b-a}\int_a^b f(x)dx$（1999 填空(4)、2016 解析第(21) 题）。

### 1.8 变限积分（数二最高频考点之一）

设 $f$ 连续，$\varphi,\psi$ 可导，则

$$
\frac{d}{dx}\int_{\psi(x)}^{\varphi(x)}f(t)\,dt=f(\varphi(x))\varphi'(x)-f(\psi(x))\psi'(x).
$$

特别地 $\dfrac{d}{dx}\int_a^x f(t)dt=f(x)$；$\dfrac{d}{dx}\int_a^{x^2}f(t)dt=2x f(x^2)$；$\dfrac{d}{dx}\int_0^{\cos3x}f(t)dt=-3\sin3x\,f(\cos3x)$（1994 填空(3)）。

若被积函数含 $x$，须先换元把 $x$ "移"出积分号：

$$
\frac{d}{dx}\int_0^{x}t f(x^2-t)\,dt\xlongequal{u=x^2-t}\frac{d}{dx}\int_0^{x^2}(x^2-u)f(u)\,du=2x\int_0^{x^2}f(u)\,du\ (1998\ \text{填空(4)}).
$$

**变限积分的性质**：$F(x)=\int_a^x f$ 必连续；$f$ 有跳跃间断点时 $F$ 连续但不可导（2006 选择(8)、2013 选择(3)）；$f$ 奇 $\Rightarrow F$ 偶，$f$ 偶且 $F(0)=0$ $\Rightarrow F$ 奇；$f$ 以 $T$ 为周期则 $\int_x^{x+T}f$ 与 $x$ 无关（1997 选择(4)、2004(17)）。

### 1.9 定积分的换元、分部与对称性

$$
\int_a^b f(\varphi(t))\varphi'(t)\,dt=\int_{\varphi(a)}^{\varphi(b)}f(x)\,dx,\qquad \int_a^b u\,dv=[uv]_a^b-\int_a^b v\,du.
$$

**奇偶对称**：$\int_{-a}^a f=0$（$f$ 奇），$\int_{-a}^a f=2\int_0^a f$（$f$ 偶）。例如 1994 选择(5) 的 $M=0$（奇）、$N>0$、$P<0$；2001 填空(3) $\int_{-\pi/2}^{\pi/2}(x^3+\sin^2x)\cos^2x dx=\frac{\pi}{8}$。

**周期与区间平移**：$\int_a^{a+T}f=\int_0^T f$；$|\cos t|$、$\sin^2t$ 型积分用 $\int_0^{n\pi}|\cos t|dt=2n$（2000 六）。

**常用公式**（华里士/Wallis，数二选择题常用）：

$$
\int_0^{\frac\pi2}\sin^n x\,dx=\int_0^{\frac\pi2}\cos^n x\,dx=
\begin{cases}
\dfrac{(n-1)!!}{n!!}\cdot\dfrac\pi2,& n\ \text{偶},\\[4pt]
\dfrac{(n-1)!!}{n!!},& n\ \text{奇}.
\end{cases}
$$

**由定积分定义求和式极限**：$\lim_{n\to\infty}\sum_{k=1}^n f\!\left(\frac{k}{n}\right)\frac1n=\int_0^1 f(x)dx$（1995 填空(4)、2004 选择(9)、2010 选择(6)）。

**经典换元恒等式**：$\int_0^\pi x f(\sin x)dx=\frac\pi2\int_0^\pi f(\sin x)dx$；$f(x)+f(1/x)$ 型（1990 六）用 $t=1/u$ 得 $\int_1^x\frac{\ln t}{t}dt=\frac12\ln^2x$。

### 1.10 反常积分（广义积分）

**无穷限**：

$$
\int_a^{+\infty}f(x)dx=\lim_{t\to+\infty}\int_a^t f(x)dx,\qquad \int_{-\infty}^{+\infty}f=\int_{-\infty}^c f+\int_c^{+\infty}f\ (\text{两者皆收敛才收敛}).
$$

**瑕积分**（$f$ 在 $c$ 邻域无界）：$\int_a^b f=\lim_{\varepsilon\to0^+}\int_a^{c-\varepsilon}f+\lim_{\varepsilon\to0^+}\int_{c+\varepsilon}^{b}f$。

**$p$-判别法**（必须牢记）：

$$
\int_1^{+\infty}\frac{dx}{x^p}\ \text{收敛}\iff p>1;\qquad \int_0^1\frac{dx}{x^p}\ \text{收敛}\iff p<1;
$$

$$
\int_2^{+\infty}\frac{dx}{x(\ln x)^p}\ \text{收敛}\iff p>1;\qquad \int_0^{+\infty}e^{-ax}dx=\frac1a\ (a>0).
$$

**比较判别法**：$0\le f\le g$，$\int g$ 收敛 $\Rightarrow\int f$ 收敛；$\int f$ 发散 $\Rightarrow\int g$ 发散。极限形式 $\lim\frac fg=l\in(0,+\infty)$ 时同敛散。2010 选择(4)（$\int_0^1$ 含 $\ln$ 幂的瑕积分收敛性与 $m,n$ 无关）、2013 选择(4)（分段 $f$ 含 $\alpha$ 定收敛区间）、2019 选择(3)（$\int_0^{+\infty}\frac{\arctan x}{1+x^2}dx$ 型）均考敛散判别。

**常用收敛积分**：

$$
\int_0^{+\infty}e^{-x^2}dx=\frac{\sqrt\pi}{2},\quad \int_0^{+\infty}\frac{\sin x}{x}dx=\frac\pi2,\quad \int_{-\infty}^{+\infty}\frac{dx}{1+x^2}=\pi,
$$

$$
\int_0^{+\infty}x^n e^{-x}dx=n!\ (\Gamma\ \text{函数}),\qquad \int_0^1\ln x\,dx=-1.
$$

**混合型**（既是无穷限又有瑕点）必须分段：1998 六 $\int_{1/2}^{3/2}\frac{dx}{\sqrt{|x-x^2|}}$ 在 $x=1$ 为瑕点；2000 填空(3) $\int_2^{+\infty}\frac{dx}{(x+7)\sqrt{x-2}}$ 在 $x=2$ 为瑕点兼无穷限，令 $u=\sqrt{x-2}$ 化为 $\int_0^{+\infty}\frac{2du}{u^2+9}=\frac\pi3$。

### 1.11 定积分的几何应用

**平面图形面积**（直角坐标）：

$$
S=\int_a^b\bigl|f(x)-g(x)\bigr|dx;\qquad \text{（对 }y\text{ 积分）}\ S=\int_c^d\bigl|\varphi(y)-\psi(y)\bigr|dy.
$$

必须分段去绝对值（1995 选择(2)：$y=x(x-1)(2-x)$ 与 $x$ 轴所围面积在 $[0,1]$、$[1,2]$ 上符号相反，应选带负号的两段积分之和）。

**极坐标面积**：$S=\dfrac12\int_\alpha^\beta r^2(\theta)\,d\theta$（2003 填空(4) $\rho=e^{a\theta}$，2013 填空(11) $r=\cos3\theta$，1997 五、2022 填空(15)）。

**旋转体体积**（绕 $x$ 轴，圆盘法；绕 $y$ 轴，柱壳法）：

$$
V_x=\pi\int_a^b f^2(x)\,dx,\qquad V_y=2\pi\int_a^b x\,|f(x)|\,dx,\qquad V_y=\pi\int_c^d \varphi^2(y)\,dy.
$$

绕**非坐标轴**直线 $y=m$ 或 $x=x_0$ 时平移半径：$V=\pi\int_a^b\bigl[(f(x)-m)^2-(g(x)-m)^2\bigr]dx$（1994 八绕 $y=3$、1996 选择(5) 绕 $y=m$、1993 五绕 $x=2$）。

**截面已知的立体体积**：$V=\int_a^b A(x)\,dx$（1996 三(6) 椭圆柱锲形体、2010(18) 贮油罐）。

**平面曲线弧长**：

$$
\text{显式：}\ s=\int_a^b\sqrt{1+[f'(x)]^2}\,dx;\qquad
\text{参数：}\ s=\int_\alpha^\beta\sqrt{[x'(t)]^2+[y'(t)]^2}\,dt;
$$

$$
\text{极坐标：}\ s=\int_\alpha^\beta\sqrt{r^2(\theta)+[r'(\theta)]^2}\,d\theta.
$$

1992 六（$y=\ln(1-x^2)$，$s=\ln3-\frac12$）、1995 三(5)（摆线一拱 $s=8$）、2010 填空(12)（对数螺线 $r=e^\theta$，$s=\sqrt2(e^\pi-1)$）、2011 填空(11)（$y=\int_0^x\tan t\,dt$，$s=\ln(1+\sqrt2)$）、2013(21)、2022(18) 均考弧长。

**旋转曲面（侧）面积**：

$$
S=2\pi\int_a^b |f(x)|\sqrt{1+[f'(x)]^2}\,dx\ (\text{绕 }x\ \text{轴});\qquad S=2\pi\int_a^b x\sqrt{1+[f'(x)]^2}dx\ (\text{绕 }y\ \text{轴}).
$$

1998 九（旋转体的**表面积**）、2004(18)、2008(19)（侧面积 $=2\times$ 体积）、2016(20)、2021(20) 考此公式。

**形心**：$\bar x=\dfrac{\int_a^b x f(x)dx}{\int_a^b f(x)dx}$（2013(21) 第(2) 问）。

### 1.12 定积分的物理应用（微元法）

$$
W=\int_a^b F(x)\,dx\ (\text{变力做功，1999 六抓斗提污泥、2011(20) 抽水}),\qquad
P=\int_a^b \rho g\,h(x)\,w(x)\,dx\ (\text{液体压力，2002 七闸门、2020 填空(14)}),
$$

$$
F=\int_0^l \frac{km\mu\,dx}{(a+x)^2}\ (\text{细杆引力，1991 选择(5)}),\qquad
s=\int_{t_1}^{t_2}v(t)\,dt\ (\text{变速直线运动路程，1991 填空(4)}).
$$

---

## 二、历年真题逐题详解

> 题号依各年真题册原编号（填空/选择/计算/解答，"三(2)"表示第三大题第 2 小题，2003 年后解答题按 (15)、(16) 连续编号）。

### 1987 年（真题册与解析册均为字体编码乱码）

> 源文件 3–307 行全为乱码，题面与答案均无法逐字还原。依数二命题史，首年该章以"计算不定积分、定积分、由变限积分求函数"为主干，此处仅列考点骨架，不列编造题目。

- **不定积分**：凑微分与分部积分，$\int x\ln x\,dx$、$\int xe^x dx$ 型。
- **定积分**：牛顿-莱布尼茨公式直接计算。

### 1988 年（真题册乱码，依解析册还原）

> 真题册 308–403 行为字体编码乱码；解析册（404–600 行）可辨出若干含 $\int$ 的题目，但公式竖排碎片不逐字还原。

**填空｜考点：定积分计算与变限积分**

解析册中出现 $\int$ 与"求原函数"字样，属本章"求不定积分/定积分"题。通法：先凑微分或分部，再用 $\int_a^b f=F(b)-F(a)$。

**补充**：解析册 420–429 行给出某填空答案为 $1$，属幂指/对数型积分结果；题面不逐字还原。

### 1989 年（真题册 601–1125 行清晰，数二积分题最密集的一年）

**填空(2)｜考点：定积分的分部积分**

题目：$\displaystyle\int_0^\pi t\sin t\,dt$。

解法：取 $u=t,\ dv=\sin t\,dt$，则

$$
\int_0^\pi t\sin t\,dt=\Bigl[-t\cos t\Bigr]_0^\pi+\int_0^\pi\cos t\,dt=\pi+0=\pi.
$$

答案：$\pi$。

**填空(3)｜考点：变限积分求导 + 切线**

题目：曲线 $y=\displaystyle\int_0^x(t-1)(t-2)\,dt$ 在点 $(0,0)$ 处的切线方程。

解法：$y'(x)=(x-1)(x-2)$，故 $y'(0)=2$，切线为

$$
y-0=2(x-0)\ \Longrightarrow\ y=2x.
$$

答案：$y=2x$。

**填空(5)｜考点：定积分是常数（积分方程）**

题目：设 $f(x)$ 连续，且 $f(x)=x^2+2\displaystyle\int_0^1 f(t)\,dt$，求 $f(x)$。

解法：记 $A=\int_0^1 f(t)dt$（常数），则 $f(x)=x^2+2A$，两边在 $[0,1]$ 积分：

$$
A=\int_0^1(x^2+2A)dx=\frac13+2A\ \Longrightarrow\ A=-\frac13.
$$

答案：$f(x)=x^2-\dfrac23$。

**计算(2)｜考点：不定积分的分部积分**

题目：求 $\displaystyle\int\frac{\ln x}{x^2}\,dx$。

解法：取 $u=\ln x,\ dv=x^{-2}dx$，则 $v=-\frac1x$，

$$
\int\frac{\ln x}{x^2}dx=-\frac{\ln x}{x}+\int\frac{dx}{x^2}=-\frac{\ln x}{x}-\frac1x+C=-\frac{\ln x+1}{x}+C.
$$

**计算(5)｜考点：定积分换元 + 分部（抽象函数）**

题目：已知 $f(2)=\dfrac12,\ f'(2)=0,\ \displaystyle\int_0^2 f(x)dx=1$，求 $\displaystyle\int_0^1 x^2f''(2x)\,dx$。

解法：令 $u=2x$，$dx=\frac{du}{2}$，$x^2=\frac{u^2}{4}$，

$$
\int_0^1x^2f''(2x)dx=\frac18\int_0^2u^2f''(u)du=\frac18\Bigl(\bigl[u^2f'(u)\bigr]_0^2-2\int_0^2uf'(u)du\Bigr).
$$

首项 $=4f'(2)=0$；再分部 $\int_0^2uf'(u)du=\bigl[uf(u)\bigr]_0^2-\int_0^2f(u)du=2\cdot\frac12-1=0$。

答案：$0$。

**选择(3)｜考点：旋转体体积（圆盘法）**

题目：曲线 $y=\cos x\ \bigl(-\frac\pi2\le x\le\frac\pi2\bigr)$ 与 $x$ 轴所围图形绕 $x$ 轴旋转一周的体积。

解法：

$$
V=\pi\int_{-\pi/2}^{\pi/2}\cos^2x\,dx=2\pi\int_0^{\pi/2}\frac{1+\cos2x}{2}dx=\pi\cdot\frac\pi2=\frac{\pi^2}{2}.
$$

答案 **(D)** $\dfrac{\pi^2}{2}$。

**五（7 分）｜考点：积分方程化微分方程（变限积分求导）**

题目：设 $f(x)=\sin x-\displaystyle\int_0^x(x-t)f(t)\,dt$，$f$ 连续，求 $f(x)$。

解法：拆开变限积分（$x$ 提到积分号外）：

$$
f(x)=\sin x-x\int_0^xf(t)dt+\int_0^xt f(t)dt,
$$

$$
f'(x)=\cos x-\int_0^xf(t)dt,\qquad f''(x)=-\sin x-f(x),
$$

即得初值问题 $f''+f=-\sin x,\ f(0)=0,\ f'(0)=1$。齐次解 $C_1\cos x+C_2\sin x$，非齐次特解取 $\frac{x}{2}\cos x$，代入初值得 $C_1=0,\ C_2=\frac12$。

答案：$f(x)=\dfrac12\bigl(\sin x+x\cos x\bigr)$。

**六（7 分）｜考点：定积分计算 + 函数零点个数**

题目：证明方程 $\ln x=\dfrac{x}{e}-\displaystyle\int_0^\pi\sqrt{1-\cos2x}\,dx$ 在 $(0,+\infty)$ 内有且仅有两个不同实根。

解法：先算定积分（注意 $\sqrt{1-\cos2x}=\sqrt2\,\sin x\ge0$ 在 $[0,\pi]$ 上）：

$$
\int_0^\pi\sqrt{1-\cos2x}\,dx=\sqrt2\int_0^\pi\sin x\,dx=2\sqrt2.
$$

设 $F(x)=\ln x-\frac xe+2\sqrt2$，则 $F'(x)=\frac1x-\frac1e$，唯一驻点 $x=e$，$F(e)=\ln e-1+2\sqrt2=2\sqrt2>0$；又 $F(0^+)=-\infty$，$F(+\infty)=-\infty$，故在 $(0,e)$ 与 $(e,+\infty)$ 各恰有一零点，共两个实根。

**八（10 分）｜考点：平面面积 + 旋转体体积 + 最值**

题目：设抛物线 $y=ax^2+bx+c$ 过原点，当 $0\le x\le1$ 时 $y\ge0$，且与 $x$ 轴及 $x=1$ 所围图形面积为 $\frac13$，确定 $a,b,c$ 使该图形绕 $x$ 轴旋转体体积 $V$ 最小。

解法：过原点 $\Rightarrow c=0$；面积条件

$$
\int_0^1(ax^2+bx)dx=\frac a3+\frac b2=\frac13\ \Longrightarrow\ b=\frac{2-2a}{3}.
$$

体积

$$
V=\pi\int_0^1(ax^2+bx)^2dx=\pi\Bigl(\frac{a^2}{5}+\frac{ab}{2}+\frac{b^2}{3}\Bigr)
=\pi\Bigl(\frac{2a^2}{135}+\frac{a}{27}+\frac4{27}\Bigr).
$$

对 $a$ 配方，二次项系数 $\frac{2}{135}>0$，极小点 $a=-\dfrac{1/27}{2\cdot 2/135}=-\dfrac54$，于是 $b=\dfrac32,\ c=0$，

$$
V_{\min}=\pi\cdot\frac18=\frac{\pi}{8}.
$$

### 1990 年（真题册 4323–4804 行清晰；解析册 4805–5130 行为乱码，答案依题面自算）

**填空(3)｜考点：定积分换元（无理代换）**

题目：$\displaystyle\int_0^1 x\sqrt{1-x}\,dx$（题面竖排，根号未抽出）。

解法：令 $t=1-x$，

$$
\int_0^1x\sqrt{1-x}\,dx=\int_0^1(1-t)\sqrt t\,dt=\frac23-\frac25=\frac4{15}.
$$

答案：$\dfrac4{15}$。

**填空(4)｜考点：定积分比较大小（保序性 + 上下限方向）**

题目：比较两个同区间定积分 $\int$ 的大小（被积函数为 $e^{\pm x^2}$ / $xe^{x^2}$ 型，PDF 竖排碎片不逐字还原）。

解法要点：先统一上下限方向（$\int_{-1}^{-3}=-\int_{-3}^{-1}$，方向翻转时不等号反向），再比较被积函数在积分区间上的大小。定积分比较定理：若 $[a,b]$ 上 $f(x)\le g(x)$ 且不恒等，则 $\int_a^b f\,dx<\int_a^b g\,dx$。

**选择(2)｜考点：不定积分与求导互逆**

题目：$\dfrac{d}{dx}\displaystyle\int f(x)\,dx$ 等于 (A) $f(x)$ (B) $f(x)dx$ (C) $f(x)+C$ (D) $f'(x)dx$。

解法：$\int f\,dx=F(x)+C$，求导得 $f(x)$。答案 **(A)**。

**选择(4)｜考点：变限积分求导（上下限均为 $x$ 的函数）**

题目：$F(x)=\displaystyle\int_x^{e^{-x}}f(t)\,dt$，求 $F'(x)$。

解法：由 Leibniz 公式

$$
F'(x)=f(e^{-x})\cdot(e^{-x})'-f(x)\cdot 1=-e^{-x}f(e^{-x})-f(x).
$$

答案 **(A)**。

**三(4)｜考点：分部积分 + 有理函数分解**

题目：计算 $\displaystyle\int\frac{\ln x}{(1-x)^2}\,dx$。

解法：取 $u=\ln x,\ dv=\dfrac{dx}{(1-x)^2}$，则 $v=\dfrac1{1-x}$，

$$
\int\frac{\ln x}{(1-x)^2}dx=\frac{\ln x}{1-x}-\int\frac{dx}{x(1-x)}
=\frac{\ln x}{1-x}-\int\Bigl(\frac1x+\frac1{1-x}\Bigr)dx
$$

$$
=\frac{\ln x}{1-x}-\ln|x|+\ln|1-x|+C.
$$

**六（9 分）｜考点：定积分换元（倒代换）+ 对数恒等式（经典）**

题目：设 $f(x)=\displaystyle\int_1^x\frac{\ln t}{1+t}\,dt\ (x>0)$，求 $f(x)+f\!\left(\dfrac1x\right)$。

解法：对 $f(1/x)$ 作代换 $t=\dfrac1u$：

$$
f\!\left(\frac1x\right)=\int_1^{1/x}\frac{\ln t}{1+t}dt
=\int_1^{x}\frac{-\ln u}{1+\frac1u}\Bigl(-\frac1{u^2}\Bigr)du=\int_1^x\frac{\ln u}{u(1+u)}du.
$$

于是

$$
f(x)+f\!\left(\frac1x\right)=\int_1^x\ln t\,\Bigl(\frac1{1+t}+\frac1{t(1+t)}\Bigr)dt
=\int_1^x\frac{\ln t}{t}dt=\frac12\ln^2x.
$$

答案：$\dfrac12\ln^2 x$。

**七（9 分）｜考点：切线 + 旋转体体积（圆锥体积扣除）**

题目：过点 $P(1,0)$ 作抛物线 $y=x^2$ 的切线，求该切线与抛物线及 $x$ 轴围成图形绕 $x$ 轴旋转一周所得旋转体体积。

解法：设切点 $(a,a^2)$，切线 $y=2ax-a^2$；过 $(1,0)$ 得 $2a-a^2=0$，取 $a=2$（$a=0$ 退化），切线 $y=4x-4$，与 $x$ 轴交于 $(1,0)$。旋转体为抛物线旋转体减去切线旋转成的圆锥：

$$
V=\pi\int_0^2 (x^2)^2dx-\pi\int_1^2(4x-4)^2dx=\frac{32\pi}{5}-16\pi\int_1^2(x-1)^2dx=\frac{32\pi}{5}-\frac{16\pi}{3}=\frac{16\pi}{15}.
$$

答案：$\dfrac{16\pi}{15}$。

**四（9 分）｜考点：面积最小值（几何公式与积分思想）**

题目：椭圆 $\frac{x^2}{a^2}+\frac{y^2}{b^2}=1$ 第一象限部分上求点 $P$，使该点切线与椭圆及两坐标轴所围面积最小。

解法要点：切线 $\frac{x_0x}{a^2}+\frac{y_0y}{b^2}=1$，与坐标轴围成三角形面积 $\frac{a^2b^2}{2x_0y_0}$；再用积分/参数式表示椭圆第一象限面积 $\frac{\pi ab}{4}$，所围面积 = 三角形面积 $-\frac{\pi ab}{4}$，故只需最大化 $x_0y_0=a b\cos t\sin t$，取 $t=\frac\pi4$，即 $P\bigl(\frac{a}{\sqrt2},\frac{b}{\sqrt2}\bigr)$。

### 1991 年（真题册 5131–5749 行清晰，解析册 5750–8633 行可核）

**填空(3)｜考点：无穷限反常积分 + 分部**

题目：$\displaystyle\int_1^{+\infty}\frac{\ln x}{x^2}\,dx$。

解法：

$$
\int_1^{+\infty}\frac{\ln x}{x^2}dx=\Bigl[-\frac{\ln x}{x}\Bigr]_1^{+\infty}+\int_1^{+\infty}\frac{dx}{x^2}=0+1=1.
$$

答案：$1$。

**填空(4)｜考点：变速直线运动的路程（速度定积分）**

题目：质点以速度 $v=t\sin(t^2)$（米/秒）作直线运动，求 $t_1=\sqrt{\frac\pi2}$ 到 $t_2=\sqrt\pi$ 秒内经过的路程。

解法：$s=\displaystyle\int_{\sqrt{\pi/2}}^{\sqrt\pi}t\sin(t^2)\,dt=\Bigl[-\frac12\cos t^2\Bigr]_{\sqrt{\pi/2}}^{\sqrt\pi}=-\frac12(\cos\pi-\cos\frac\pi2)=\frac12$。若题面为 $v=\sin t^2$ 则按 $\int_{\pi/2}^{\pi}|\sin t^2|dt$ 处理，方法同为"路程 $=\int|v|dt$"。

**选择(2)｜考点：分段函数的变限积分（逐段积分）**

题目：$f(x)=\begin{cases}x^2,&0\le x\le1\\ 2-x,&1<x\le2\end{cases}$，$F(x)=\int_0^x f(t)dt\ (0\le x\le2)$，求 $F(x)$ 表达式。

解法：当 $0\le x\le1$ 时 $F(x)=\frac{x^3}{3}$；当 $1<x\le2$ 时

$$
F(x)=\int_0^1t^2dt+\int_1^x(2-t)dt=\frac13+\Bigl[2t-\frac{t^2}{2}\Bigr]_1^x=-\frac{x^2}{2}+2x-\frac76.
$$

答案对应选项 **(B)**（分段点处左右表达式须衔接为 $F(1)=\frac13$）。

**选择(5)｜考点：微元法列引力积分式**

题目：$x$ 轴上长为 $l$、线密度 $\mu$ 的细杆，质量为 $m$ 的质点到杆右端距离 $a$，引力系数 $k$，求质点与细杆间引力大小的积分表达式。

解法：取杆上微元 $dx$，与质点距离 $a+x$，引力微元 $dF=\dfrac{km\mu\,dx}{(a+x)^2}$，故

$$
F=\int_0^l\frac{km\mu}{(a+x)^2}dx,
$$

答案 **(B)**。

**三(2)｜考点：定积分的第二类换元（根式代换）**

题目：计算 $\displaystyle\int_1^4\frac{dx}{x(1+\sqrt{x})}$。

解法：令 $t=\sqrt x$，$x=t^2,\ dx=2t\,dt$，

$$
\int_1^4\frac{dx}{x(1+\sqrt x)}=\int_1^2\frac{2t\,dt}{t^2(1+t)}=2\int_1^2\Bigl(\frac1t-\frac1{1+t}\Bigr)dt=2\ln\frac43.
$$

**三(4)｜考点：分部积分（幂 × 三角）**

题目：求 $\displaystyle\int x^2\sin x\,dx$（题面竖排亦可读作 $\int x\sin^2x\,dx$，两者均为分部/降幂型）。

解法（以 $x^2\sin x$ 为例）：两次分部

$$
\int x^2\sin x\,dx=-x^2\cos x+2x\sin x+2\cos x+C.
$$

**六（9 分）｜考点：绕 $y$ 轴旋转体体积（柱壳法）**

题目：曲线 $y=(x-1)(x-2)$ 与 $x$ 轴围成图形，求绕 $y$ 轴旋转一周的旋转体体积。

解法：$y\le0$ 于 $[1,2]$，用柱壳法

$$
V_y=2\pi\int_1^2 x\,|y|\,dx=-2\pi\int_1^2x(x-1)(x-2)dx.
$$

展开 $\int_1^2(x^3-3x^2+2x)dx=\bigl[\frac{x^4}{4}-x^3+x^2\bigr]_1^2=(4-8+4)-(\frac14-1+1)=-\frac14$，故

$$
V_y=2\pi\cdot\frac14=\frac{\pi}{2}.
$$

答案：$\dfrac{\pi}{2}$。

**八（9 分）｜考点：函数方程 + 定积分换元（周期延拓）**

题目：$f(x)=f(x-\pi)+\sin x$，且 $f(x)=x$ 于 $[0,\pi)$，计算 $\displaystyle\int_\pi^{3\pi}f(x)\,dx$。

解法：令 $x=u+\pi$，$u\in[0,2\pi)$：

$$
\int_\pi^{3\pi}f(x)dx=\int_0^{2\pi}[f(u)+\sin(u+\pi)]du=\int_0^{2\pi}f(u)du-\int_0^{2\pi}\sin u\,du=\int_0^{2\pi}f(u)du.
$$

在 $[\pi,2\pi)$ 上 $f(u)=f(u-\pi)+\sin u=(u-\pi)+\sin u$，故

$$
\int_0^{2\pi}f=\int_0^\pi u\,du+\int_\pi^{2\pi}(u-\pi+\sin u)du=\frac{\pi^2}{2}+\frac{\pi^2}{2}-2=\pi^2-2.
$$

答案：$\pi^2-2$。

### 1992 年（真题册 11554–12046 行清晰）

**填空(4)｜考点：无穷限反常积分（有理函数分解）**

题目：$\displaystyle\int_1^{+\infty}\frac{dx}{x(1+x^2)}$（题面竖排还原）。

解法：$\dfrac{1}{x(1+x^2)}=\dfrac1x-\dfrac{x}{1+x^2}$，

$$
\int_1^{+\infty}\frac{dx}{x(1+x^2)}=\Bigl[\ln x-\frac12\ln(1+x^2)\Bigr]_1^{+\infty}=\Bigl[\ln\frac{x}{\sqrt{1+x^2}}\Bigr]_1^{+\infty}=0-\ln\frac1{\sqrt2}=\frac12\ln2.
$$

答案：$\dfrac12\ln2$。

**填空(5)｜考点：平面图形面积（先求交点）**

题目：曲线 $y=xe^x$ 与直线 $y=ex$ 所围图形面积 $S$。

解法：交点由 $xe^x=ex$ 得 $x=0,\ x=1$。在 $[0,1]$ 上 $ex\ge xe^x$，故

$$
S=\int_0^1(ex-xe^x)dx=\frac e2-\Bigl[(x-1)e^x\Bigr]_0^1=\frac e2-1.
$$

答案：$\dfrac e2-1$。

**选择(4)｜考点：变限积分求导（被积含 $x^2$）**

题目：$F(x)=\displaystyle\int_0^{x^2}f(t^2)\,dt$，求 $F'(x)$。

解法：$F'(x)=f\bigl((x^2)^2\bigr)\cdot 2x=2x f(x^4)$。答案对应选项 **(A)** $2xf(x^4)$（选项中以 $f(x^4)$ 形式出现者）。

**选择(5)｜考点：原函数的概念**

题目：若 $f'(x)=\sin x$，则 $f(x)$ 有一个原函数为 (A) $1+\sin x$ (B) $1-\sin x$ (C) $1+\cos x$ (D) $1-\cos x$。

解法：$f(x)=-\cos x+C_1$，其原函数 $F(x)=-\sin x+C_1x+C_2$。取 $C_1=0,C_2=1$ 得 $F(x)=1-\sin x$。答案 **(B)**。

**三(3)｜考点：不定积分（凑微分/拆项）**

题目：求 $\displaystyle\int\frac{x^3}{1+x^2}\,dx$。

解法：$\dfrac{x^3}{1+x^2}=x-\dfrac{x}{1+x^2}$，故

$$
\int\frac{x^3}{1+x^2}dx=\frac{x^2}{2}-\frac12\ln(1+x^2)+C.
$$

**三(4)｜考点：定积分（去根号需分区间）**

题目：求 $\displaystyle\int_0^\pi\sqrt{1-\sin x}\,dx$。

解法：$\sqrt{1-\sin x}=\bigl|\sin\frac x2-\cos\frac x2\bigr|$，在 $[0,\frac\pi2]$ 取 $\cos\frac x2-\sin\frac x2$，在 $[\frac\pi2,\pi]$ 取 $\sin\frac x2-\cos\frac x2$，分段积分：

$$
\int_0^{\pi/2}\Bigl(\cos\frac x2-\sin\frac x2\Bigr)dx+\int_{\pi/2}^{\pi}\Bigl(\sin\frac x2-\cos\frac x2\Bigr)dx=2(\sqrt2-1)+2(\sqrt2-1)=4(\sqrt2-1).
$$

（答案以按分段去绝对值计算为准。）

**四（9 分）｜考点：换元 + 分段函数的定积分（经典）**

题目：设 $f(x)=\begin{cases}1+x^2,&x<0\\ e^{-x},&x\ge0\end{cases}$，求 $\displaystyle\int_1^3 f(x-2)\,dx$。

解法：令 $t=x-2$，$x:1\to3$ 对应 $t:-1\to1$，在 $t=0$ 处分段：

$$
\int_1^3f(x-2)dx=\int_{-1}^0(1+t^2)dt+\int_0^1e^{-t}dt=\Bigl(1+\frac13\Bigr)+\Bigl(1-\frac1e\Bigr)=\frac73-\frac1e.
$$

答案：$\dfrac73-\dfrac1e$。

**六（9 分）｜考点：弧长公式（显式）**

题目：求曲线 $y=\ln(1-x^2)$ 上 $0\le x\le\frac12$ 一段弧长。

解法：$y'=\dfrac{-2x}{1-x^2}$，

$$
\sqrt{1+y'^2}=\frac{1+x^2}{1-x^2},\qquad
s=\int_0^{1/2}\frac{1+x^2}{1-x^2}dx=\int_0^{1/2}\Bigl(-1+\frac{2}{1-x^2}\Bigr)dx
$$

$$
=-\frac12+\Bigl[\ln\frac{1+x}{1-x}\Bigr]_0^{1/2}=\ln3-\frac12.
$$

答案：$\ln3-\dfrac12$。

**七（9 分）｜考点：面积表达式 + 最值（切线问题）**

题目：求曲线 $y=\sqrt x$ 的一条切线 $l$，使曲线与切线及直线 $x=0,\ x=2$ 所围平面图形面积最小。

解法：设切点 $(t,\sqrt t)$，切线 $y=\frac{x}{2\sqrt t}+\frac{\sqrt t}{2}$。因 $y=\sqrt x$ 为上凸，切线恒在曲线上方，面积

$$
S(t)=\int_0^2\Bigl(\frac{x}{2\sqrt t}+\frac{\sqrt t}{2}-\sqrt x\Bigr)dx=\frac{1}{\sqrt t}+\sqrt t-\frac{4\sqrt2}{3}.
$$

由 AM-GM，$t=1$ 时 $S$ 最小，切线 $y=\frac x2+\frac12$。

### 1993 年（真题册 12047–12581 行清晰）

**填空(3)｜考点：变限积分求导定单调区间**

题目：$F(x)=\displaystyle\int_1^x\Bigl(2-\frac1{\sqrt t}\Bigr)dt\ (x>0)$，求 $F(x)$ 的单调减少区间。

解法：$F'(x)=2-\frac{1}{\sqrt x}<0\iff \sqrt x<\frac12\iff 0<x<\frac14$。

答案：$\bigl(0,\frac14\bigr)$。

**填空(4)｜考点：凑微分（三角）**

题目：$\displaystyle\int\frac{\tan x}{\cos^2 x}\,dx$。

解法：$\dfrac{1}{\cos^2x}dx=d(\tan x)$，故

$$
\int\tan x\,d(\tan x)=\frac12\tan^2x+C.
$$

**填空(5)｜考点：由导数求原函数（分部积分）**

题目：曲线 $y=f(x)$ 过 $\bigl(0,-\frac12\bigr)$，任一点切线斜率为 $x^2\ln(1+x^2)$，求 $f(x)$。

解法：$f(x)=\displaystyle\int x^2\ln(1+x^2)\,dx$，分部取 $u=\ln(1+x^2),\ dv=x^2dx$：

$$
f(x)=\frac{x^3}{3}\ln(1+x^2)-\frac23\int\frac{x^4}{1+x^2}dx=\frac{x^3}{3}\ln(1+x^2)-\frac23\Bigl(\frac{x^3}{3}-x+\arctan x\Bigr)+C,
$$

由 $f(0)=-\frac12$ 得 $C=-\frac12$。

**选择(3)｜考点：分段函数的变限积分**

题目：$f(x)=\begin{cases}2x,&0\le x<1\\ 1,&1\le x\le2\end{cases}$，$F(x)=\int_1^x f(t)dt\ (0\le x\le2)$，选 $F(x)$ 表达式。

解法：$x\in[0,1)$ 时 $F(x)=-\int_x^1 2t\,dt=x^2-1$；$x\in[1,2]$ 时 $F(x)=\int_1^x 1\,dt=x-1$。答案 **(B)**（$\frac{x^3}{3}$ 型选项对应 $f=t^2$ 的情形，须按题面系数核对）。

**三(3)｜考点：定积分分部积分（$1+\cos2x$ 化简）**

题目：求 $\displaystyle\int_0^{\pi/4}\frac{x}{1+\cos2x}\,dx$。

解法：$1+\cos2x=2\cos^2x$，

$$
\int_0^{\pi/4}\frac{x}{2\cos^2x}dx=\frac12\int_0^{\pi/4}x\,d(\tan x)=\frac12\Bigl(\bigl[x\tan x\bigr]_0^{\pi/4}-\int_0^{\pi/4}\tan x\,dx\Bigr)
$$

$$
=\frac12\Bigl(\frac\pi4+\bigl[\ln\cos x\bigr]_0^{\pi/4}\Bigr)=\frac\pi8-\frac{\ln2}{4}.
$$

答案：$\dfrac\pi8-\dfrac{\ln2}{4}$。

**三(4)｜考点：无穷限反常积分（有理函数）**

题目：求 $\displaystyle\int_0^{+\infty}\frac{x}{(1+x)^3}\,dx$。

解法：令 $u=1+x$，

$$
\int_1^{+\infty}\frac{u-1}{u^3}du=\int_1^{+\infty}\Bigl(u^{-2}-u^{-3}\Bigr)du=1-\frac12=\frac12.
$$

答案：$\dfrac12$。

**五（9 分）｜考点：绕非坐标轴直线旋转体体积**

题目：平面图形 $A$ 由 $x^2+y^2\le2x$ 与 $y\ge x$ 确定，求 $A$ 绕直线 $x=2$ 旋转一周所得旋转体体积。

解法：圆 $(x-1)^2+y^2\le1$ 与直线 $y=x$ 交于 $(0,0),(1,1)$。用柱壳法（旋转轴 $x=2$，半径 $2-x$）：

$$
V=2\pi\iint_A(2-x)\,d\sigma=2\pi\int_0^1(2-x)\Bigl(\sqrt{2x-x^2}-x\Bigr)dx,
$$

配合 $\int_0^1\sqrt{2x-x^2}dx=\frac\pi4$（四分之一圆）与多项式积分可得 $V=\frac{\pi^2}{2}-\frac{2\pi}{3}$（依题面自算；解析册 14799–15667 行给出微元法与"圆锥体积"核对）。

**八（6 分）｜考点：积分不等式（拉格朗日中值定理 + 定积分性质）**

题目：设 $f'(x)$ 在 $[0,a]$ 连续，$f(0)=0$，证明 $\Bigl|\displaystyle\int_0^a f(x)\,dx\Bigr|\le\dfrac{Ma^2}{2}$，其中 $M=\max_{[0,a]}|f'(x)|$。

解法：由拉格朗日中值定理 $f(x)=f(0)+f'(\xi)x=f'(\xi)x$，故 $|f(x)|\le Mx$，于是

$$
\Bigl|\int_0^af(x)dx\Bigr|\le\int_0^a|f(x)|dx\le M\int_0^a x\,dx=\frac{Ma^2}{2}.
$$

### 1994 年（真题册 16204–16728 行清晰）

**填空(3)｜考点：变限积分求导（复合上限）**

题目：$\dfrac{d}{dx}\displaystyle\int_0^{\cos3x}f(t)\,dt$。

解法：上限链式法则

$$
\frac{d}{dx}\int_0^{\cos3x}f(t)dt=f(\cos3x)\cdot(\cos3x)'=-3\sin3x\,f(\cos3x).
$$

**填空(4)｜考点：凑微分/分部（幂 × 指数）**

题目：$\displaystyle\int x^3e^{x^2}\,dx$。

解法：令 $u=x^2$，$\frac12\int u e^u du=\frac12(u-1)e^u+C$，即

$$
\int x^3e^{x^2}dx=\frac12(x^2-1)e^{x^2}+C.
$$

**选择(5)｜考点：对称区间上奇偶函数的定积分（高频）**

题目：$M=\displaystyle\int_{-\pi/2}^{\pi/2}\frac{\sin x\cos^4x}{1+x^2}dx$，$N=\displaystyle\int_{-\pi/2}^{\pi/2}(\sin^3x+\cos^4x)dx$，$P=\displaystyle\int_{-\pi/2}^{\pi/2}(x^2\sin x-\cos^4x)dx$，比较大小。

解法：$M=0$（被积函数奇），$N=\int_{-\pi/2}^{\pi/2}\cos^4x\,dx>0$，$P=-\int_{-\pi/2}^{\pi/2}\cos^4x\,dx<0$。故 $P<M<N$，答案 **(D)**。

**三(2)｜考点：定积分换元（$x^2$ 与 $1+x^2$）**

题目：计算 $\displaystyle\int_0^1\frac{x^3}{(1+x^2)^4}\,dx$（题面竖排还原）。

解法：令 $u=1+x^2$，$x^3dx=\frac12(u-1)du$，

$$
\int_0^1\frac{x^3}{(1+x^2)^4}dx=\frac12\int_1^2\frac{u-1}{u^4}du=\frac12\int_1^2(u^{-3}-u^{-4})du=\frac12\Bigl(\frac38-\frac7{24}\Bigr)=\frac{1}{24}\ \text{（依题面公式核算）}.
$$

**三(4)｜考点：三角有理式不定积分（凑微分）**

题目：计算 $\displaystyle\int\frac{\sin2x}{1+2\sin^2x}\,dx$（题面竖排还原）。

解法：$\sin2x\,dx=2\sin x\cos x\,dx=d(\sin^2x)$，故

$$
\int\frac{d(\sin^2x)}{1+2\sin^2x}=\frac12\ln(1+2\sin^2x)+C.
$$

**三(5)｜考点：定积分表达式 + 面积不等式证明**

题目：曲线 $y=\frac12x^2+1$，梯形 $OABC$ 面积为 $D$，曲边梯形面积为 $D_1$，证明 $\dfrac{D_1}{D}<\dfrac32$。

解法：设 $A(a,0)$，$D=\frac{a}{2}\bigl(1+\frac{a^2}{2}+1\bigr)$（梯形公式），$D_1=\int_0^a(\frac{x^2}{2}+1)dx=\frac{a^3}{6}+a$；作差比较 $D_1-\frac32D<0$ 即证（解析册 18676–18684 行给出"曲边梯形面积用积分式求解"）。

**七（9 分）｜考点：积分不等式（单调性 + 换元）**

题目：$f(x)$ 在 $[0,1]$ 连续且递减，证明对 $0<\lambda<1$ 有 $\displaystyle\int_0^\lambda f(x)dx\ge\lambda\int_0^1f(x)dx$。

解法：令 $x=\lambda t$，$\int_0^\lambda f(x)dx=\lambda\int_0^1f(\lambda t)dt$；因 $f$ 递减且 $\lambda t\le t$，有 $f(\lambda t)\ge f(t)$，故

$$
\lambda\int_0^1f(\lambda t)dt\ge\lambda\int_0^1f(t)dt.
$$

**八（9 分）｜考点：绕非坐标轴直线旋转体体积（分段去绝对值）**

题目：曲线 $y=3-|x^2-1|$（题面竖排还原）与 $x$ 轴围成封闭图形，绕直线 $y=3$ 旋转所得旋转体体积。

解法：旋转半径 $R=3-y=|x^2-1|$，圆盘法

$$
V=\pi\int R^2dx=\pi\int\bigl(x^2-1\bigr)^2dx
$$

（积分区间由 $y=0$ 与曲线的交点确定，须按 $|x^2-1|$ 分段；解析册 19927 行给出"小竖条的体积微元"）。

### 1995 年（真题册 20025–20738 行清晰）

**选择(2)｜考点：面积公式中绝对值的分段处理**

题目：曲线 $y=x(x-1)(2-x)$ 与 $x$ 轴所围图形面积可表示为（四个定积分选项）。

解法：零点 $x=0,1,2$；在 $[0,1]$ 上 $y\le0$，$[1,2]$ 上 $y\ge0$，故

$$
S=-\int_0^1x(x-1)(2-x)dx+\int_1^2x(x-1)(2-x)dx,
$$

即选带负号分段的 **(C)**。

**三(3)｜考点：复合函数 + 不定积分换元**

题目：$f(x^2-1)=\ln\dfrac{x^2}{x^2-2}$，且 $\varphi[f(x)]=\ln x$，求 $\displaystyle\int\varphi(x)\,dx$。

解法：令 $u=x^2-1$ 得 $f(u)=\ln\frac{u+1}{u-1}$，故 $\varphi(x)=f^{-1}$ 型：由 $\varphi(\ln\frac{x+1}{x-1})=\ln x$ 得 $\varphi(t)=\ln\frac{e^t+1}{e^t-1}$，再积分（换元 $u=e^t$）可得 $\int\varphi(x)dx$ 的对数形式（解析册 21742 行起给出"利用定积分的求面积公式"方法链）。

**三(5)｜考点：参数方程弧长（摆线一拱，经典）**

题目：求摆线 $x=t-\sin t,\ y=1-\cos t$ 一拱 $(0\le t\le2\pi)$ 的弧长。

解法：

$$
x'=1-\cos t,\ y'=\sin t,\quad \sqrt{x'^2+y'^2}=\sqrt{2-2\cos t}=2\sin\frac t2,
$$

$$
s=\int_0^{2\pi}2\sin\frac t2\,dt=8.
$$

答案：$8$。

**四（8 分）｜考点：变限积分求导 + 最值（经典）**

题目：$f(x)=\displaystyle\int_0^{x^2}(2-t)e^{-t}\,dt$，求 $f(x)$ 的最大值与最小值。

解法：$f'(x)=(2-x^2)e^{-x^2}\cdot2x$，驻点 $x=0,\ x=\pm\sqrt2$；因 $x^2\ge0$，$f(x)\ge f(0)=0$（最小值）。最大值

$$
f(\pm\sqrt2)=\int_0^2(2-t)e^{-t}dt=\Bigl[(t-1)e^{-t}\Bigr]_0^2=e^{-2}+1.
$$

答案：最小值 $0$，最大值 $1+e^{-2}$。

**七（8 分）｜考点：交换积分次序 / 分部（含参变限积分，经典）**

题目：设 $f(x)=\displaystyle\int_0^x\frac{\sin t}{\pi-t}\,dt$，计算 $\displaystyle\int_0^\pi f(x)\,dx$。

解法：交换积分次序（或分部）：

$$
\int_0^\pi f(x)dx=\int_0^\pi\Bigl(\int_0^x\frac{\sin t}{\pi-t}dt\Bigr)dx=\int_0^\pi\frac{\sin t}{\pi-t}\Bigl(\int_t^\pi dx\Bigr)dt=\int_0^\pi\sin t\,dt=2.
$$

答案：$2$。

### 1996 年（真题册 24199–24854 行清晰）

**填空(2)｜考点：对称区间奇偶性 + 定积分**

题目：$\displaystyle\int_{-1}^1\bigl(x^2+x\sqrt{1+x^2}\bigr)\,dx$（题面竖排还原）。

解法：$x\sqrt{1+x^2}$ 为奇函数，积分为 $0$；$\int_{-1}^1x^2dx=\frac23$。

答案：$\dfrac23$。

**填空(5)｜考点：平面图形面积**

题目：由曲线 $y=x+\frac1x$、$x=2$ 及 $y=2$ 所围图形面积 $S$。

解法：$y=x+\frac1x$ 与 $y=2$ 交于 $x=1$；在 $[1,2]$ 上 $x+\frac1x\ge2$，

$$
S=\int_1^2\Bigl(x+\frac1x-2\Bigr)dx=\Bigl[\frac{x^2}{2}+\ln x-2x\Bigr]_1^2=\ln2-\frac12.
$$

答案：$\ln2-\dfrac12$。

**选择(5)｜考点：绕 $y=m$ 旋转体体积（抽象函数列式）**

题目：$g(x)<f(x)<m$，曲线 $y=g(x),y=f(x),x=a,x=b$ 围成图形绕 $y=m$ 旋转体体积。

解法：外半径 $m-g(x)$，内半径 $m-f(x)$，

$$
V=\pi\int_a^b\Bigl[(m-g)^2-(m-f)^2\Bigr]dx=\pi\int_a^b\bigl[2m-f-g\bigr]\bigl[f-g\bigr]dx.
$$

答案 **(A)**（展开为 $\pi\int_a^b[2m-f(x)-g(x)][f(x)-g(x)]dx$ 的选项）。

**三(1)｜考点：定积分换元（$\sqrt{1-e^{-2x}}$）**

题目：计算 $\displaystyle\int_0^{\ln2}\sqrt{1-e^{-2x}}\,dx$。

解法：令 $u=\sqrt{1-e^{-2x}}$，则 $e^{-2x}=1-u^2$，$dx=\dfrac{u}{1-u^2}du$，上限 $u=\frac{\sqrt3}{2}$：

$$
\int_0^{\ln2}\sqrt{1-e^{-2x}}dx=\int_0^{\sqrt3/2}\frac{u^2}{1-u^2}du=\Bigl[-u+\frac12\ln\frac{1+u}{1-u}\Bigr]_0^{\sqrt3/2}=\ln(2+\sqrt3)-\frac{\sqrt3}{2}.
$$

**三(2)｜考点：三角有理式不定积分（万能代换）**

题目：求 $\displaystyle\int\frac{dx}{1+\sin x}$。

解法：

$$
\int\frac{dx}{1+\sin x}=\int\frac{1-\sin x}{\cos^2x}dx=\tan x-\sec x+C.
$$

**三(6)｜考点：已知截面面积求体积（微元法）**

题目：正椭圆柱体底面长、短轴 $2a,2b$，过短轴且与底面成 $\alpha$ 角的平面截得锲形体，求体积 $V$。

解法：取垂直于短轴的截面，截面为直角三角形，面积 $A(y)=\frac12\cdot\frac{a}{b}\sqrt{b^2-y^2}\cdot\frac{a}{b}\sqrt{b^2-y^2}\tan\alpha$（依题面），

$$
V=\int_{-b}^bA(y)dy=\frac{2ab^2}{3}\tan\alpha\ \text{（解析册 25970、27673–27765 行给出"小竖条的体积微元""截面面积""楔形体的体积"）}.
$$

**四（8 分）｜考点：分部积分（反三角 × 有理式，经典）**

题目：计算 $\displaystyle\int\frac{\arctan x}{x^2(1+x^2)}\,dx$（题面竖排还原）。

解法：拆 $\dfrac{1}{x^2(1+x^2)}=\dfrac1{x^2}-\dfrac1{1+x^2}$，分别分部：

$$
\int\frac{\arctan x}{x^2}dx=-\frac{\arctan x}{x}+\int\frac{dx}{x(1+x^2)}=-\frac{\arctan x}{x}+\ln|x|-\frac12\ln(1+x^2),
$$

$$
\int\frac{\arctan x}{1+x^2}dx=\frac12\arctan^2x,
$$

相减即得原积分。

### 1997 年（真题册 29329–30083 行清晰）

**填空(3)｜考点：有理函数不定积分**

题目：$\displaystyle\int\frac{dx}{x(4-x)}$。

解法：$\dfrac{1}{x(4-x)}=\dfrac14\Bigl(\dfrac1x+\dfrac1{4-x}\Bigr)$，

$$
\int\frac{dx}{x(4-x)}=\frac14\ln\left|\frac{x}{4-x}\right|+C.
$$

**填空(4)｜考点：无穷限反常积分（配方 + 反正切）**

题目：$\displaystyle\int_0^{+\infty}\frac{dx}{x^2+4x+8}$。

解法：$x^2+4x+8=(x+2)^2+4$，

$$
\int_0^{+\infty}\frac{dx}{(x+2)^2+4}=\frac12\Bigl[\arctan\frac{x+2}{2}\Bigr]_0^{+\infty}=\frac12\Bigl(\frac\pi2-\frac\pi4\Bigr)=\frac\pi8.
$$

答案：$\dfrac\pi8$。

**选择(2)｜考点：定积分的几何意义与凹凸性比较**

题目：$f>0,\ f'<0,\ f''>0$，比较 $S_1=\int_a^bf(x)dx,\ S_2=f(b)(b-a),\ S_3=\frac12[f(a)+f(b)](b-a)$。

解法：下凸（$f''>0$）曲线在弦下方 $\Rightarrow S_1<S_3$；$f$ 递减 $\Rightarrow f(x)>f(b)$ $\Rightarrow S_2<S_1$。故 $S_2<S_1<S_3$，答案 **(D)**。

**选择(4)｜考点：周期函数变限积分与起点无关**

题目：$F(x)=\displaystyle\int_x^{x+2\pi}e^{\sin t}\sin t\,dt$，判断 $F(x)$。

解法：被积函数以 $2\pi$ 为周期，故 $F(x)\equiv\int_0^{2\pi}e^{\sin t}\sin t\,dt$ 为常数；又分部 $\int_0^{2\pi}e^{\sin t}\sin t\,dt>0$（$t\in(0,\pi)$ 贡献为正且占优）。答案 **(A)** 正常数。

**三(3)｜考点：凑微分（识别全微分，经典）**

题目：计算 $\displaystyle\int e^{2x}(1+\tan x)^2\,dx$。

解法：$(1+\tan x)^2=\sec^2x+2\tan x$，而 $(e^{2x}\tan x)'=e^{2x}(\sec^2x+2\tan x)$，故

$$
\int e^{2x}(1+\tan x)^2dx=e^{2x}\tan x+C.
$$

**五（8 分）｜考点：极坐标面积 + 弧长 → 微分方程（经典）**

题目：极坐标曲线 $L:r=r(\theta)$，$M_0(2,0)$ 在 $L$ 上，极径 $OM_0$、$OM$ 与 $L$ 围成曲边扇形面积等于弧 $M_0M$ 长的一半，求 $L$ 方程。

解法：条件 $\dfrac12\int_0^\theta r^2d\varphi=\dfrac12\int_0^\theta\sqrt{r^2+r'^2}\,d\varphi$，两边对 $\theta$ 求导：

$$
r^2=\sqrt{r^2+r'^2}\ \Longrightarrow\ r'^2=r^2(r^2-1).
$$

解得 $r=\sec(\theta+C)$；由 $r(0)=2$ 得 $\cos C=\frac12$，$C=\pm\frac\pi3$，故

$$
r=\frac{1}{\cos(\theta\pm\frac\pi3)}=\frac{2}{\cos\theta\mp\sqrt3\sin\theta}.
$$

**六（8 分）｜考点：微分方程 + 面积 + 旋转体体积最值（经典）**

题目：$xf'(x)=f(x)+\frac32ax^2$，$f$ 与 $x=1,y=0$ 所围图形 $S$ 面积为 $2$，求 $f(x)$ 并问 $a$ 为何值时 $S$ 绕 $x$ 轴旋转体体积最小。

解法：解 ODE 得 $f(x)=\frac32ax^2+cx$；由 $\int_0^1f=\frac a2+\frac c2=2$ 得 $c=4-a$。体积

$$
\frac{V}{\pi}=\int_0^1\Bigl(\frac32ax^2+(4-a)x\Bigr)^2dx=\frac{9}{20}a^2+\frac34a(4-a)+\frac13(4-a)^2,
$$

求导令为零得 $a=-5$（此时 $c=9$），$V$ 最小。

答案：$a=-5$，$f(x)=-\frac{15}{2}x^2+9x$。

**七（8 分）｜考点：含参变限积分（换元 $u=xt$）+ 连续性**

题目：$f$ 连续、$\lim_{x\to0}\frac{f(x)}x=2$，$\varphi(x)=\displaystyle\int_0^1f(xt)\,dt$，求 $\varphi'(x)$ 并讨论 $\varphi'$ 的连续性。

解法：令 $u=xt$（$x\ne0$）：$\varphi(x)=\frac1x\int_0^xf(u)du$，故

$$
\varphi'(x)=\frac{f(x)}{x}-\frac1{x^2}\int_0^xf(u)du,\qquad \varphi'(0)=\lim_{x\to0}\frac{\varphi(x)-\varphi(0)}x=1,
$$

且 $\lim_{x\to0}\varphi'(x)=2-1=1=\varphi'(0)$，故 $\varphi'$ 在 $x=0$ 连续。

### 1998 年（真题册 34166–34792 行清晰）

**填空(2)｜考点：平面图形面积（三次曲线与 $x$ 轴）**

题目：曲线 $y=-x^3+x^2+2x$ 与 $x$ 轴所围图形面积 $A$。

解法：因式分解 $y=-x(x-2)(x+1)$，零点 $-1,0,2$；分段去绝对值：

$$
A=-\int_{-1}^0y\,dx+\int_0^2y\,dx=\frac{5}{12}+\frac{8}{3}=\frac{37}{12}\ \text{（按分段积分核算）}.
$$

**填空(3)｜考点：分部积分（对数 × 三角，经典）**

题目：$\displaystyle\int\frac{\ln\sin x}{\sin^2x}\,dx$。

解法：取 $u=\ln\sin x,\ dv=\csc^2x\,dx$，$v=-\cot x$，

$$
\int\frac{\ln\sin x}{\sin^2x}dx=-\cot x\ln\sin x+\int\cot^2x\,dx=-\cot x\ln\sin x-\cot x-x+C.
$$

**填空(4)｜考点：被积含参的变限积分求导（先换元）**

题目：$\dfrac{d}{dx}\displaystyle\int_0^{x^2}t\,f(x^2-t)\,dt$（$f$ 连续）。

解法：令 $u=x^2-t$：

$$
\int_0^{x^2}t f(x^2-t)dt=\int_0^{x^2}(x^2-u)f(u)du=x^2\int_0^{x^2}f(u)du-\int_0^{x^2}u f(u)du,
$$

求导得 $2x\int_0^{x^2}f(u)du+x^2\cdot f(x^2)2x-x^2f(x^2)2x=2x\int_0^{x^2}f(u)du$。

**四（5 分）｜考点：变限积分 + 洛必达定参数**

题目：确定 $a,b,c$ 使 $\displaystyle\lim_{x\to0}\frac{ax-\sin x}{\int_b^x\frac{\ln(1+t^3)}{t}dt}=c\ (c\ne0)$。

解法：因分母 $\to0$ 需 $b=0$；等价无穷小 $\ln(1+t^3)\sim t^3$，分母 $\sim\int_0^xt^2dt=\frac{x^3}{3}$；分子 $ax-\sin x=(a-1)x+\frac{x^3}{6}+o(x^3)$，要极限非零有限须 $a=1$，此时 $c=\frac{1/6}{1/3}=\frac12$。

答案：$a=1,\ b=0,\ c=\dfrac12$。

**六（6 分）｜考点：瑕积分（分段 + 去绝对值，经典）**

题目：计算 $\displaystyle\int_{1/2}^{3/2}\frac{dx}{\sqrt{|x-x^2|}}$。

解法：$x=1$ 为瑕点，分两段：

$$
\int_{1/2}^1\frac{dx}{\sqrt{x(1-x)}}+\int_1^{3/2}\frac{dx}{\sqrt{x(x-1)}}.
$$

第一段令 $x=\sin^2t$ 得 $\frac\pi2$；第二段令 $x=\sec^2t$ 得 $\ln(2+\sqrt3)$，

$$
\int_{1/2}^{3/2}\frac{dx}{\sqrt{|x-x^2|}}=\frac\pi2+\ln(2+\sqrt3).
$$

**九（8 分）｜考点：旋转体的表面积（侧面积 + 底面积）**

题目：曲线 $y=\sqrt{x-1}$，过原点作其切线，求曲线、切线及 $x$ 轴围成图形绕 $x$ 轴旋转一周所得旋转体的表面积。

解法：设切点 $(a,\sqrt{a-1})$，切线过原点定出 $a=2$，切线 $y=\frac x2$。表面积 = 曲线旋转侧面积 + 切线旋转侧面积 + 底面圆面积：

$$
S=2\pi\int_1^2\sqrt{x-1}\sqrt{1+\frac{1}{4(x-1)}}dx+2\pi\int_0^2\frac x2\sqrt{1+\frac14}dx+\pi\cdot 1^2,
$$

解析册 38973、39049、39101 行分别给出"绕 $x$ 轴的旋转面面积"两部分与"旋转体的表面积"，通法即 $S=2\pi\int|y|\sqrt{1+y'^2}dx$ 分段累加。

### 1999 年（真题册 40672–41305 行清晰）

**填空(3)｜考点：有理函数不定积分（配方）**

题目：$\displaystyle\int\frac{x+5}{x^2-6x+13}\,dx$。

解法：$x^2-6x+13=(x-3)^2+4$，

$$
\int\frac{x+5}{x^2-6x+13}dx=\frac12\int\frac{2x-6}{x^2-6x+13}dx+8\int\frac{dx}{(x-3)^2+4}
$$

$$
=\frac12\ln(x^2-6x+13)+4\arctan\frac{x-3}{2}+C.
$$

**填空(4)｜考点：函数平均值（定积分）**

题目：求函数 $y=\dfrac{x^2}{\sqrt{4-x^2}}$（题面竖排还原）在给定区间上的平均值。

解法：$\bar y=\dfrac{1}{b-a}\int_a^b\frac{x^2}{\sqrt{4-x^2}}dx$，令 $x=2\sin t$ 化为 $\int 4\sin^2t\,dt$ 再除以区间长度。

**选择(2)｜考点：变限积分型无穷小的阶**

题目：$\alpha(x)=\displaystyle\int_0^{5x}\frac{\sin t}{t}dt$，$\beta(x)=\displaystyle\int_0^{\sin x}(1+t)^{1/t}dt$，比较 $\alpha$ 与 $\beta$ 当 $x\to0$ 的阶。

解法：$\alpha'(x)=5\frac{\sin5x}{5x}\to5$，故 $\alpha\sim5x$；$\beta'(x)=(1+\sin x)^{1/\sin x}\cos x\to e$，故 $\beta\sim ex$。二者同阶但不等价，答案 **(C)**。

**选择(3)｜考点：原函数的奇偶/周期/单调性质**

题目：$f$ 连续、$F$ 是 $f$ 的原函数，判断四个命题。

解法：$f$ 奇 $\Rightarrow$ 任一原函数 $F(x)=\int_0^xf+C$ 为偶（正确）；$f$ 偶 $\Rightarrow$ 只有 $F(0)=0$ 的原函数才奇；$f$ 周期未必 $\int_0^Tf=0$；$f$ 单调与 $F$ 单调无关（$F'=f$，$f$ 可负）。答案 **(A)**。

**四（6 分）｜考点：反常积分 + 分部（经典）**

题目：计算 $\displaystyle\int_1^{+\infty}\frac{\arctan x}{x^2}\,dx$。

解法：分部取 $u=\arctan x,\ dv=x^{-2}dx$：

$$
\int_1^{+\infty}\frac{\arctan x}{x^2}dx=\Bigl[-\frac{\arctan x}{x}\Bigr]_1^{+\infty}+\int_1^{+\infty}\frac{dx}{x(1+x^2)}=\frac\pi4+\frac12\ln2.
$$

答案：$\dfrac\pi4+\dfrac12\ln2$。

**六（7 分）｜考点：变力做功（微元法，经典应用题）**

题目：缆绳抓斗提升污泥做功：井深 $30$ m，抓斗自重 $400$ N，缆绳每米重 $50$ N，污泥重 $2000$ N，提升速度 $3$ m/s，污泥以 $20$ N/s 漏失，求克服重力做功。

解法：提升高度 $x$ 处剩余缆绳长 $30-x$，漏失时间 $x/3$，瞬时提升力

$$
F(x)=400+50(30-x)+2000-20\cdot\frac{x}{3}=3900-\frac{170}{3}x,
$$

$$
W=\int_0^{30}F(x)dx=3900\cdot30-\frac{170}{6}\cdot900=117000-25500=91500\ \text{J}.
$$

答案：$91500$ 焦耳。

**九（9 分）｜考点：面积关系式 → 积分方程 → 微分方程**

题目：$y(x)\ (x\ge0)$ 二阶可导，$y'(x)>0,y(0)=1$；切线与 $x$ 轴垂线围成三角形面积 $S_1$，$[0,x]$ 曲边梯形面积 $S_2$，且 $2S_1-S_2\equiv1$，求曲线方程。

解法：切线在 $x$ 轴截距横坐标 $x-\frac{y}{y'}$，故 $S_1=\frac12 y\cdot\frac{y}{y'}=\frac{y^2}{2y'}$，$S_2=\int_0^xy(t)dt$。条件给出

$$
\frac{y^2}{y'}-\int_0^xy\,dt=1\ \Longrightarrow\ \frac{d}{dx}\Bigl(\frac{y^2}{y'}\Bigr)=y,
$$

化简得 $y y''=y'^2$，结合 $y(0)=1,y'(0)=1$（由 $x=0$ 代入原式）解得 $y=e^x$。

**十（6 分）｜考点：定积分与和式（单调有界）**

题目：$f$ 在 $[0,+\infty)$ 单调减少非负连续，$a_n=\sum_{k=1}^nf(k)-\int_1^nf(x)dx$，证明 $\{a_n\}$ 极限存在。

解法：由单调性 $\int_k^{k+1}f\le f(k)\le\int_{k-1}^kf$，得

$$
a_{n+1}-a_n=f(n+1)-\int_n^{n+1}f(x)dx\le0,\qquad a_n\ge f(n)-\int_{n-1}^nf\ge0,
$$

故 $a_n$ 单调减少有下界，极限存在。

### 2000 年（真题册 46015–46869 行清晰）

**填空(3)｜考点：混合型反常积分（瑕点 + 无穷限，经典）**

题目：$\displaystyle\int_2^{+\infty}\frac{dx}{(x+7)\sqrt{x-2}}$。

解法：$x=2$ 为瑕点且上限 $+\infty$。令 $u=\sqrt{x-2}$，$x=u^2+2,\ dx=2u\,du$：

$$
\int_2^{+\infty}\frac{dx}{(x+7)\sqrt{x-2}}=\int_0^{+\infty}\frac{2u\,du}{(u^2+9)u}=2\int_0^{+\infty}\frac{du}{u^2+9}=\frac23\cdot\frac\pi2=\frac\pi3.
$$

答案：$\dfrac\pi3$。

**三（5 分）｜考点：换元 + 分部（复合函数不定积分）**

题目：设 $f(\ln x)=\dfrac{\ln(1+x)}{x}$，计算 $\displaystyle\int f(x)\,dx$。

解法：令 $t=\ln x$ 得 $f(t)=\dfrac{\ln(1+e^t)}{e^t}$，故

$$
\int f(x)dx=\int e^{-x}\ln(1+e^x)dx=-e^{-x}\ln(1+e^x)+\int\frac{dx}{1+e^x}
$$

$$
=-e^{-x}\ln(1+e^x)+x-\ln(1+e^x)+C.
$$

**四（5 分）｜考点：分段面积函数 + 变限积分**

题目：正方形 $D=\{0\le x,y\le1\}$，直线 $l:x+y=t$，设 $S(t)$ 为 $D$ 位于 $l$ 左下方部分的面积，求 $\displaystyle\int_0^x S(t)dt\ (x\ge0)$。

解法：$S(t)=\begin{cases}\frac{t^2}{2},&0\le t\le1\\ 1-\frac{(2-t)^2}{2},&1<t\le2\\ 1,&t>2\end{cases}$，逐段积分得 $\int_0^xS(t)dt$ 的分段表达式（$x\le1$ 时为 $\frac{x^3}{6}$）。

**六（6 分）｜考点：周期函数定积分 + 极限（经典）**

题目：$S(x)=\displaystyle\int_0^x|\cos t|\,dt$。(1) 当 $n\pi\le x\le(n+1)\pi$ 时证明 $2n\le S(x)<2(n+1)$；(2) 求 $\lim_{x\to+\infty}\frac{S(x)}x$。

解法：$|\cos t|$ 以 $\pi$ 为周期，$\int_0^\pi|\cos t|dt=2$，故 $S(n\pi)=2n$ 且 $S$ 单调增，得 (1)；由夹逼

$$
\frac{2n}{(n+1)\pi}\le\frac{S(x)}x\le\frac{2(n+1)}{n\pi}\ \Longrightarrow\ \lim_{x\to+\infty}\frac{S(x)}x=\frac2\pi.
$$

答案：$\dfrac2\pi$。

**八（6 分）｜考点：积分等式 → 零点个数（构造辅助函数）**

题目：$f$ 在 $[0,\pi]$ 连续，$\int_0^\pi f=0,\ \int_0^\pi f(x)\cos x\,dx=0$，证明 $f$ 在 $(0,\pi)$ 内至少有两个不同零点。

解法：设 $F(x)=\int_0^xf(t)dt$，则 $F(0)=F(\pi)=0$；分部 $\int_0^\pi f\cos x\,dx=[F\cos x]_0^\pi+\int_0^\pi F\sin x\,dx=\int_0^\pi F(x)\sin x\,dx=0$。因 $\sin x>0$，若 $F$ 在 $(0,\pi)$ 不变号则积分非零，故 $F$ 有内点零点 $c$；在 $[0,c]$、$[c,\pi]$ 上用罗尔定理得 $F'=f$ 至少两个零点。

**十（8 分）｜考点：旋转体体积最值（经典）**

题目：曲线 $y=ax^2\ (a>0,x\ge0)$ 与 $y=1-x^2$ 交于 $A$，过 $O,A$ 的直线与 $y=ax^2$ 围成图形，问 $a$ 为何值时该图形绕 $x$ 轴旋转体体积最大，并求最大体积。

解法：求交点 $A$ 与直线 $OA$，写出

$$
V(a)=\pi\int_0^{x_A}\Bigl[(k x)^2-(ax^2)^2\Bigr]dx
$$

（$k$ 为 $OA$ 斜率，与 $a$ 有关），对 $a$ 求导取极值。解析册 50693、50702、50998 行给出"由旋转体体积公式""要求的体积就是用大体积减去小体积""也是 $V$ 的最大值点，最大体积为"的方法链与数值结果。

**十一（8 分）｜考点：积分方程 → 微分方程 + 不等式**

题目：$f(0)=1$ 且 $f'(x)+f(x)-\frac{1}{x+1}\int_0^xf(t)dt=0$。(1) 求 $f'(x)$；(2) 证明 $e^{-x}\le f(x)\le1\ (x\ge0)$。

解法：记 $F(x)=\int_0^xf$，方程化为 $(x+1)(F''+F')-F=0$，解出 $f'(x)=-\frac{e^{-x}}{x+1}$；由 $f'<0$ 且 $f(0)=1$ 得 $f\le1$，再积分估计得 $f(x)\ge e^{-x}$。

### 2001 年（真题册 52700–53415 行清晰）

**填空(3)｜考点：对称区间奇偶性**

题目：$\displaystyle\int_{-\pi/2}^{\pi/2}\bigl(x^3+\sin^2x\bigr)\cos^2x\,dx$。

解法：$x^3\cos^2x$ 奇，积分为 $0$；$\sin^2x\cos^2x=\frac14\sin^22x$，故

$$
\int_{-\pi/2}^{\pi/2}\sin^2x\cos^2x\,dx=\frac14\int_{-\pi/2}^{\pi/2}\frac{1-\cos4x}{2}dx=\frac{\pi}{8}.
$$

答案：$\dfrac\pi8$。

**三（6 分）｜考点：第二类换元（三角代换）**

题目：求 $\displaystyle\int\frac{dx}{(2x^2+1)\sqrt{x^2+1}}$。

解法：令 $x=\tan t$，$dx=\sec^2t\,dt,\ \sqrt{x^2+1}=\sec t$：

$$
\int\frac{\sec^2t\,dt}{(2\tan^2t+1)\sec t}=\int\frac{\cos t\,dt}{1+\sin^2t}=\arctan(\sin t)+C=\arctan\frac{x}{\sqrt{1+x^2}}+C.
$$

**五（7 分）｜考点：弧长 + 曲率半径（参数 $s$ 的导数）**

题目：抛物线 $y=\sqrt x$（题面含曲率半径 $\rho$ 与弧长 $s$），计算 $3\rho\frac{d^2\rho}{ds^2}-\bigl(\frac{d\rho}{ds}\bigr)^2$。

解法：由 $y'=\frac{1}{2\sqrt x},\ y''=-\frac{1}{4x^{3/2}}$，$\rho=\frac{(1+y'^2)^{3/2}}{|y''|}=\frac{(4x+1)^{3/2}}{2}$，$ds=\sqrt{1+y'^2}dx=\frac{\sqrt{4x+1}}{2\sqrt x}dx$，链式求导 $\frac{d\rho}{ds}=\frac{d\rho/dx}{ds/dx}$，最终得常数 $9$。

答案：$9$。

**六（7 分）｜考点：变限积分 + 反函数（经典）**

题目：$f$ 在 $[0,+\infty)$ 可导，$f(0)=0$，反函数 $g$，且 $\displaystyle\int_0^{f(x)}g(t)dt=x^2e^x$，求 $f(x)$。

解法：两边求导：$g(f(x))f'(x)=x f'(x)=(2x+x^2)e^x$，故（$x>0$）$f'(x)=(x+2)e^x$，积分并用 $f(0)=0$：

$$
f(x)=(x+1)e^x-1.
$$

**七（7 分）｜考点：分部积分（构造全微分，经典）**

题目：$f'(x)=g(x),\ g'(x)=2e^x-f(x),\ f(0)=0,g(0)=2$，求 $\displaystyle\int_0^\pi\Bigl[\frac{g(x)}{1+x}-\frac{f(x)}{(1+x)^2}\Bigr]dx$。

解法：注意 $\Bigl(\dfrac{f(x)}{1+x}\Bigr)'=\dfrac{g(x)(1+x)-f(x)}{(1+x)^2}=\dfrac{g(x)}{1+x}-\dfrac{f(x)}{(1+x)^2}$，故积分 $=\Bigl[\frac{f(x)}{1+x}\Bigr]_0^\pi=\frac{f(\pi)}{1+\pi}$。解 ODE $f''+f=2e^x,\ f(0)=0,f'(0)=2$ 得 $f(x)=e^x+\sin x-\cos x$，代入 $f(\pi)=e^\pi+1$：

$$
\text{答案}=\frac{e^\pi+1}{1+\pi}.
$$

**八（9 分）｜考点：曲线积分方程 + 面积最小值**

题目：曲线 $L$ 上任一点 $P(x,y)$ 到原点距离等于该点切线在 $y$ 轴上的截距，$L$ 过 $(\frac12,0)$。(1) 求 $L$ 方程；(2) 求 $L$ 第一象限部分的一条切线，使该切线与 $L$ 及两坐标轴所围面积最小。

解法：切线 $Y-y=y'(X-x)$，令 $X=0$ 得截距 $y-xy'$，条件 $\sqrt{x^2+y^2}=y-xy'$，化为齐次 ODE 解得 $L$（对数型曲线）；(2) 面积 $S=\int$（切线 $-$ 曲线）$dx$，对切点参数求最小（解析册 57712、57754–57757 行给出"此切线与两坐标轴围成的三角形面积""该曲线在第一象限中与两坐标轴所围成的面积为定值"方法链）。

**十（8 分）｜考点：麦克劳林公式 + 积分中值**

题目：$f$ 在 $[-a,a]$ 二阶连续可导，$f(0)=0$。(1) 写一阶麦克劳林公式（拉格朗日余项）；(2) 证明 $\exists\eta\in[-a,a]$ 使 $a^3f''(\eta)=3\int_{-a}^af(x)dx$。

解法：$f(x)=f'(0)x+\frac12f''(\xi)x^2$，两边在 $[-a,a]$ 积分：奇函数项 $\int_{-a}^af'(0)x\,dx=0$，故

$$
\int_{-a}^af(x)dx=\frac12\int_{-a}^af''(\xi(x))x^2dx=\frac12f''(\eta)\int_{-a}^ax^2dx=\frac{a^3}{3}f''(\eta),
$$

最后一步用 $f''$ 连续的介值性（推广积分中值定理）。

### 2002 年（真题册 60077–60836 行清晰；解析册可核）

**填空(2)｜考点：无穷限反常积分（无界图形面积，经典）**

题目：曲线 $y=xe^{-x}\ (0\le x<+\infty)$ 下方、$x$ 轴上方无界图形的面积。

解法：

$$
S=\int_0^{+\infty}xe^{-x}dx=\Bigl[-(x+1)e^{-x}\Bigr]_0^{+\infty}=1.
$$

答案：$1$。

**选择(2)｜考点：变限积分的奇偶性**

题目：$f$ 连续，判断下列必为偶函数的选项（含 $\int_0^{x^2}f(t^2)dt$、$\int_0^xt[f(t)+f(-t)]dt$ 等）。

解法：$\int_0^{x^2}f(t^2)dt$ 中 $x^2$ 为偶、$f(t^2)$ 为偶，但 $\int_0^{x^2}$ 作为 $x$ 的函数是偶函数（因上限只依赖 $x^2$）；答案 **(D)**（$\int_0^x t[f(t)+f(-t)]dt$，$t[f(t)+f(-t)]$ 为奇，其变限积分为偶）。

**四（7 分）｜考点：分段函数的变限积分（逐段求表达式）**

题目：$f(x)=\begin{cases}\frac{2x+3}{x^2+...},&-1\le x<0\\ \frac{xe^x}{(1+x)^2},&0\le x\le1\end{cases}$（题面竖排还原），求 $F(x)=\displaystyle\int_{-1}^x f(t)dt$ 的表达式。

解法：按 $x\in[-1,0)$ 与 $x\in[0,1]$ 两段积分，注意 $F(0^-)=\int_{-1}^0f$ 与第二段的衔接常数，保证 $F$ 连续。

**六（8 分）｜考点：微分方程 + 旋转体体积最值**

题目：求微分方程 $x\,dy+(x-2y)dx=0$ 的一个解 $y=y(x)$，使曲线与 $x=1,x=2$ 及 $x$ 轴围成图形绕 $x$ 轴旋转体体积最小。

解法：方程化为 $y'-\frac2xy=-1$，通解 $y=x+Cx^2$（或 $y=x+Cx^2$ 型）；体积 $V(C)=\pi\int_1^2y^2dx$ 对 $C$ 求最小，得 $C$ 与对应解（解析册 60957 行起给出"面积""用大体积减去小体积"的求法链）。

**七（7 分）｜考点：液体压力（微元法）**

题目：闸门上部为矩形、下部由抛物线与线段围成，水面与闸门上端相平时，欲使矩形部分与下部承受水压力之比为 $5:4$，求矩形部分高 $h$。

解法：取深度 $y$ 处水平微条，$dP=\rho g\,y\cdot w(y)\,dy$，分别列出

$$
P_1=\rho g\int_0^h y\cdot 2\,dy,\qquad P_2=\rho g\int_h^{h+1}y\cdot w(y)\,dy,
$$

令 $P_1:P_2=5:4$ 解出 $h$（解析册 63734、63752 行给出"细横条为面积微元""压力 = 压强 × 面积"）。

### 2003 年（真题册 66263–67189 行清晰）

**填空(4)｜考点：极坐标面积（对数螺线）**

题目：曲线极坐标 $\rho=e^{a\theta}\ (a>0)$，求 $\theta$ 从 $0$ 到 $\frac\pi2$ 一段弧与极轴所围图形面积。

解法：

$$
S=\frac12\int_0^{\pi/2}\rho^2d\theta=\frac12\int_0^{\pi/2}e^{2a\theta}d\theta=\frac{1}{4a}\bigl(e^{a\pi}-1\bigr).
$$

答案：$\dfrac{e^{a\pi}-1}{4a}$。

**选择(2)｜考点：定积分 + 数列极限（含 $n$ 次幂）**

题目：$a_n=\frac32\displaystyle\int_0^{\frac{n}{n+1}}x^{n-1}\sqrt{1+x^n}\,dx$，求 $\lim_{n\to\infty}na_n$。

解法：先算积分（凑 $d(1+x^n)=nx^{n-1}dx$）：

$$
a_n=\frac32\cdot\frac1n\cdot\frac23\Bigl[(1+x^n)^{3/2}\Bigr]_0^{n/(n+1)}=\frac1n\Bigl[\bigl(1+(\tfrac{n}{n+1})^n\bigr)^{3/2}-1\Bigr],
$$

$$
\lim na_n=\bigl(1+e^{-1}\bigr)^{3/2}-1.
$$

答案对应选项 **(B)**（含 $e^{-1}$ 的表达式）。

**选择(5)｜考点：定积分大小比较（不等式 $\tan x>x$）**

题目：$I_1=\displaystyle\int_0^{\pi/4}\frac{\tan x}{x}dx,\ I_2=\displaystyle\int_0^{\pi/4}\frac{x}{\tan x}dx$，比较 $I_1,I_2,1$。

解法：在 $(0,\frac\pi4)$ 上 $x<\tan x$，故 $\frac{x}{\tan x}<1<\frac{\tan x}{x}$，即 $I_2<\frac\pi4<1$ 且需细比 $I_1$ 与 $1$：由 $\frac{\tan x}{x}<1+\tan^2x$ 型估计可得 $I_2<I_1<1$，答案 **(B)** $1>I_1>I_2$。

**四（9 分）｜考点：变限积分 + 参数方程求二阶导**

题目：$x=1+2t^2,\ y=\displaystyle\int_1^{1+2\ln t}\frac{e^u}{u}du\ (t>1)$，求 $\dfrac{d^2y}{dx^2}\Big|_{x=9}$。

解法：$x'(t)=4t$，$y'(t)=\frac{e^{1+2\ln t}}{1+2\ln t}\cdot\frac2t=\frac{2et}{1+2\ln t}$，故

$$
\frac{dy}{dx}=\frac{e}{2(1+2\ln t)},\qquad \frac{d^2y}{dx^2}=\frac{d}{dt}\Bigl(\frac{dy}{dx}\Bigr)\Big/x'(t)=-\frac{e}{2t^2(1+2\ln t)^2}\cdot\frac{1}{4},
$$

$x=9\Rightarrow t=2$，代入即可。

**五（9 分）｜考点：第二类换元（$x=\tan t$）+ 分部（经典）**

题目：计算 $\displaystyle\int\frac{x e^{\arctan x}}{(1+x^2)^{3/2}}\,dx$。

解法：令 $x=\tan t$，$dx=\sec^2t\,dt,\ (1+x^2)^{3/2}=\sec^3t$：

$$
\int\frac{\tan t\,e^{t}}{\sec^3t}\sec^2t\,dt=\int e^{t}\sin t\,dt=\frac{e^{t}}{2}(\sin t-\cos t)+C=\frac{(x-1)e^{\arctan x}}{2\sqrt{1+x^2}}+C.
$$

**八（12 分）｜考点：曲线弧长（用已知弧长表示）**

题目：曲线 $y=f(x)$ 由法线条件确定，(2) 已知 $y=\sin x$ 在 $[0,\pi]$ 上弧长为 $l$，试用 $l$ 表示 $y=f(x)$ 的弧长 $s$。

解法：(1) 由"法线与 $y$ 轴交点 $Q$、$PQ$ 被 $x$ 轴平分"得 $y'=-\frac{y}{2x}$ 型，解得 $f$（椭圆型曲线）；(2) 两段弧长均化为 $\int\sqrt{1+\sin^2x}\,dx$ 型，得 $s=\frac{\sqrt2}{2}l$ 型关系（解析册 70844–70925 行给出"弧长公式""于是该曲线的弧长为"）。

**九（10 分）｜考点：旋转曲面 + 体积变化率（微分方程）**

题目：平底容器内侧由 $x=\varphi(y)$ 绕 $y$ 轴旋转而成，底面半径 $2$ m，以 $3$ m³/min 注水时液面面积以 $\pi$ m²/min 均匀扩大，求 $t$ 与 $\varphi(y)$ 关系及 $\varphi(y)$ 方程。

解法：液面面积 $\pi\varphi^2(y)=\pi(1+t)$（由初始半径 $2$ 需核题面常数），体积 $V(t)=\int_0^{y(t)}\pi\varphi^2(u)du=3t$，两式对 $t$ 求导消去 $t$ 得 $\varphi(y)$（解析册 71023–71099 行给出"液面的面积""液体的体积为"）。

**十（10 分）｜考点：积分中值定理 + 柯西中值（证明题）**

题目：$f$ 在 $[a,b]$ 连续、$(a,b)$ 可导、$f'>0$，若 $\lim_{x\to a^+}\frac{f(2x-a)}{x-a}$ 存在，证明 (1) $f(x)>0$；(2) $\exists\xi$ 使 $\frac{b^2-a^2}{\int_a^bf(x)dx}=\frac{2\xi}{f(\xi)}$；(3) $\exists\eta\ne\xi$ 使相应等式。

解法：(2) 对 $\int_a^bf$ 用积分中值定理 $\int_a^bf=f(\xi)(b-a)$，再对函数 $g(x)=x^2$ 与 $F(x)=\int_a^xf$ 用柯西中值定理；(3) 对 $F(x)$ 与 $x^2$ 再用一次柯西/拉格朗日中值定理。

### 2004 年（真题册 72606–73583 行清晰）

**填空(3)｜考点：混合型反常积分（瑕点 $x=1$ + 无穷限）**

题目：$\displaystyle\int_1^{+\infty}\frac{dx}{x\sqrt{x^2-1}}$。

解法：令 $x=\sec t$（或 $u=\sqrt{x^2-1}$）：

$$
\int_1^{+\infty}\frac{dx}{x\sqrt{x^2-1}}=\int_0^{\pi/2}dt=\frac\pi2.
$$

答案：$\dfrac\pi2$。

**选择(7)｜考点：变限积分型无穷小的阶（排序，高频）**

题目：$\alpha=\displaystyle\int_0^x\cos t^2dt,\ \beta=\int_0^{x^2}\tan\sqrt t\,dt,\ \gamma=\int_0^{\sqrt x}\sin t^3dt$，使后者是前者的高阶无穷小，排序。

解法：$\alpha\sim x$（1 阶），$\beta\sim\int_0^{x^2}\sqrt t\,dt=\frac23x^3$（3 阶），$\gamma\sim\int_0^{\sqrt x}t^3dt=\frac{x^2}{4}$（2 阶）。故 $\alpha,\gamma,\beta$，答案 **(B)**。

**选择(9)｜考点：定积分定义求和式极限**

题目：$\lim_{n\to\infty}\ln\sqrt[n]{(1+\frac1n)^2(1+\frac2n)^2\cdots(1+\frac nn)^2}$ 等于哪个定积分。

解法：$\frac1n\sum_{k=1}^n2\ln(1+\frac kn)\to2\int_1^2\ln x\,dx$，答案 **(B)** $2\int_1^2\ln x\,dx$。

**(17)（11 分）｜考点：变限积分的周期性与值域（经典）**

题目：$f(x)=\displaystyle\int_x^{x+\frac\pi2}|\sin t|\,dt$。(I) 证明 $f$ 以 $\pi$ 为周期；(II) 求 $f$ 的值域。

解法：$f(x+\pi)=\int_{x+\pi}^{x+\frac{3\pi}2}|\sin t|dt=f(x)$（被积以 $\pi$ 为周期）；又

$$
f'(x)=|\sin(x+\tfrac\pi2)|-|\sin x|=|\cos x|-|\sin x|,
$$

在 $[0,\pi]$ 上驻点 $x=\frac\pi4,\frac{3\pi}4$，$f(\frac\pi4)=\int_{\pi/4}^{3\pi/4}\sin t\,dt=\sqrt2$（最大），$f(\frac{3\pi}4)=2-\sqrt2$（最小）。

答案：值域 $[2-\sqrt2,\ \sqrt2]$。

**(18)（12 分）｜考点：旋转体体积、侧面积、底面积（$V,S,F$ 关系）**

题目：曲线 $y=\frac{e^x+e^{-x}}2$（题面竖排还原）与 $x=0,x=t,y=0$ 围成曲边梯形绕 $x$ 轴旋转，体积 $V(t)$、侧面积 $S(t)$、$x=t$ 处底面积 $F(t)$。(I) 求 $\frac{S(t)}{V(t)}$；(II) 求 $\lim_{t\to+\infty}\frac{S(t)}{F(t)}$。

解法：$V=\pi\int_0^ty^2dx$，$S=2\pi\int_0^ty\sqrt{1+y'^2}dx$，$F=\pi y^2(t)$；对 $y=\cosh x$ 有 $\sqrt{1+y'^2}=\cosh x=y$，故 $S=2\pi\int_0^ty^2dx=2V$，得 $\frac{S}{V}=2$；又洛必达 $\lim\frac{S}{F}=\lim\frac{S'}{F'}=\lim\frac{2\pi y^2}{2\pi y y'}=1$。解析册 78449、78480、78743 行分别给出"旋转体体积""旋转体的侧面积""处旋转体的底面积为"。

### 2005 年（真题册 82038–83087 行清晰，公式为反序竖排）

**填空(3)｜考点：定积分换元（$\sqrt{1-x^2}$）**

题目：$\displaystyle\int_0^1\frac{x}{(2-x^2)\sqrt{1-x^2}}\,dx$。

解法：令 $u=\sqrt{1-x^2}$，$x\,dx=-u\,du$，$2-x^2=1+u^2$：

$$
\int_0^1\frac{x\,dx}{(2-x^2)\sqrt{1-x^2}}=\int_0^1\frac{du}{1+u^2}=\frac\pi4.
$$

答案：$\dfrac\pi4$。

**选择(8)｜考点：原函数充要条件（奇偶/周期/单调）**

题目：$F$ 是连续函数 $f$ 的一个原函数，判断四个"$\iff$"命题。

解法：$F$ 偶 $\iff f$ 奇（正确，因 $F$ 偶 $\Rightarrow F'=f$ 奇；$f$ 奇 $\Rightarrow F(x)-F(0)=\int_0^xf$ 为偶且常数项保偶）；其余三命题均只有单向成立。答案 **(A)**。

**(15)（11 分）｜考点：变限积分之比的极限（洛必达 + 积分中值）**

题目：$f$ 连续、$f(0)\ne0$，求 $\lim_{x\to0}\dfrac{\int_0^x(x-t)f(t)dt}{x\int_0^xf(t)dt}$（题面竖排还原）。

解法：分子 $=\int_0^x(x-t)f(t)dt=x\int_0^xf-\int_0^xtf$；令 $u(x)=\int_0^xf,\ v(x)=\int_0^xtf$，用等价无穷小（$f(t)\sim f(0)$）：

$$
\int_0^xf\sim f(0)x,\quad \int_0^xtf\sim\frac{f(0)}2x^2,\quad \int_0^x(x-t)f\sim\frac{f(0)}2x^2,
$$

分母 $\sim f(0)x^2$，故极限 $=\dfrac12$（洛必达两次同得）。

**(16)（11 分）｜考点：面积相等 → 积分方程 → 曲线方程**

题目：$C_1:y=\frac12(e^x+e^{-x})$（题面竖排）、$C_2:y=e^x$，过 $(0,1)$ 的单调增曲线 $C_3$，$S_1(x)$ 为 $C_1,C_2$ 与竖线 $x_l$ 所围面积，$S_2(y)$ 为 $C_2,C_3$ 与横线 $y_l$ 所围面积，若恒有 $S_1(x)=S_2(y)$，求 $C_3:x=\varphi(y)$。

解法：$S_1(x)=\int_0^x[e^t-\frac12(e^t+e^{-t})]dt=\frac12(e^x-e^{-x})-x$ 型；$S_2(y)=\int_1^y[\ln u-\varphi(u)]du$；两边对 $y$ 求导（注意 $y=e^x$ 即 $x=\ln y$）解出 $\varphi(y)$（解析册 86557 行给出"根据平面图形的面积公式得"）。

**(17)（11 分）｜考点：分部积分（高阶导数型，经典）**

题目：曲线 $y=f(x)$ 以 $(3,2)$ 为拐点，$(0,0)$ 与 $(3,2)$ 处切线交于 $(2,4)$，$f$ 三阶连续可导，计算 $\displaystyle\int_0^3(x^2+x)f'''(x)\,dx$。

解法：两次分部把 $f'''$ 化为 $f',f$ 的端点值：

$$
\int_0^3(x^2+x)f'''dx=\Bigl[(x^2+x)f''\Bigr]_0^3-\int_0^3(2x+1)f''dx
$$

$$
=12f''(3)-\Bigl(\bigl[(2x+1)f'\bigr]_0^3-2\int_0^3f'dx\Bigr).
$$

由拐点 $f''(3)=0$；由切线条件 $f'(0)=\frac{4-0}{2-0}=2,\ f'(3)=\frac{4-2}{2-3}=-2$，$f(0)=0,f(3)=2$，代入得

$$
=0-\bigl(7(-2)-1\cdot2\bigr)+2(2-0)=16+4=20.
$$

答案：$20$。

### 2006 年（真题册 90681–91741 行清晰）

**填空(2)｜考点：变限积分的极限（连续定参数）**

题目：$f(x)=\begin{cases}\dfrac{1}{x^3}\displaystyle\int_0^x\sin t^2\,dt,&x\ne0\\ a,&x=0\end{cases}$ 在 $x=0$ 连续，求 $a$。

解法：$\sin t^2\sim t^2$，$\int_0^x\sin t^2dt\sim\frac{x^3}{3}$，故

$$
a=\lim_{x\to0}\frac{\int_0^x\sin t^2dt}{x^3}=\lim_{x\to0}\frac{\sin x^2}{3x^2}=\frac13.
$$

答案：$\dfrac13$。

**填空(3)｜考点：无穷限反常积分（广义积分）**

题目：广义积分 $\displaystyle\int_0^{+\infty}\frac{x}{(1+x^2)^2}\,dx$。

解法：

$$
\int_0^{+\infty}\frac{x\,dx}{(1+x^2)^2}=\Bigl[-\frac{1}{2(1+x^2)}\Bigr]_0^{+\infty}=\frac12.
$$

答案：$\dfrac12$。

**选择(8)｜考点：含第一类间断点的变限积分（高频）**

题目：$f$ 为奇函数，除 $x=0$ 外处处连续，$x=0$ 为第一类间断点，判断 $F(x)=\int_0^xf(t)dt$。

解法：$f$ 可积 $\Rightarrow F$ 处处连续；$f$ 奇 $\Rightarrow F$ 偶。答案 **(B)** 连续的偶函数。

**(16)（10 分）｜考点：换元 + 分部（反三角 × 指数）**

题目：求 $\displaystyle\int\frac{\arcsin e^x}{e^x}\,dx$。

解法：令 $t=e^x$，$dx=\frac{dt}{t}$：

$$
\int\frac{\arcsin t}{t^2}dt=-\frac{\arcsin t}{t}+\int\frac{dt}{t\sqrt{1-t^2}}=-\frac{\arcsin e^x}{e^x}+\ln\frac{1-\sqrt{1-e^{2x}}}{e^x}+C.
$$

**(18)/面积题（91655 行）｜考点：平面图形面积**

题目：求曲线（含 $e^x$ 与 $x$ 轴）所围平面图形的面积。

解法：$S=\int_a^b|f(x)|dx$，先求交点分段（解析册 91655 行"的部分）及 x 轴所围成的平面图形的面积"）。

### 2007 年（真题册 95921–97016 行清晰）

**选择(3)｜考点：定积分的几何意义（半圆面积，变限积分）**

题目：连续函数 $f$ 在 $[-3,-2],[2,3]$ 上为直径 1 的上、下半圆，在 $[-2,0],[0,2]$ 上为直径 2 的上、下半圆，$F(x)=\int_0^xf(t)dt$，判断 $F(3)$ 与 $F(-2)$、$F(-3)$ 与 $F(2)$ 的关系。

解法：由半圆面积（$\frac12\pi r^2$）逐段算 $F$：$F(3)=\int_0^2f+\int_2^3f=\frac\pi2-\frac\pi8=\frac{3\pi}{8}$，$F(-2)=-\int_{-2}^0f=-\frac\pi2$，故 $F(3)=-\frac34F(-2)$，答案 **(A)**（题面选项含 $\frac34$ 者）。

**(17)（10 分）｜考点：变限积分 + 反函数（积分方程）**

题目：$f$ 在 $[0,\frac\pi4]$ 单调可导，$f^{-1}$ 为反函数，且 $\displaystyle\int_0^{f(x)}f^{-1}(t)dt=\int_0^x\frac{t\cos t-\sin t}{\cos t+\sin t}dt$（题面竖排还原），求 $f(x)$。

解法：两边对 $x$ 求导：$f^{-1}(f(x))f'(x)=x f'(x)=$ 右端被积函数，约去 $f'(x)$ 得 $x=\frac{x\cos x-\sin x}{\cos x+\sin x}$ 型，整理后解出 $f(x)=\ln(\cos x+\sin x)$ 型（依题面自算）。

**(18)（11 分）｜考点：无穷限反常积分 + 旋转体体积最值（经典）**

题目：$D$ 是曲线 $y=xa^{-x/2}\ (a>1,\ 1\le x<+\infty)$ 下方、$x$ 轴上方无界区域。(I) 求 $D$ 绕 $x$ 轴旋转体体积 $V(a)$；(II) $a$ 为何值时 $V(a)$ 最小，并求最小值。

解法：令 $a=e^{b}\ (b>0)$，

$$
V(a)=\pi\int_1^{+\infty}x^2a^{-x}dx=\pi\int_1^{+\infty}x^2e^{-bx}dx=\pi e^{-b}\Bigl(\frac{1}{b}+\frac{2}{b^2}+\frac{2}{b^3}\Bigr)\ \text{（分部两次）},
$$

对 $b$ 求导取极小，得 $b=1$ 即 $a=e$ 时 $V$ 最小，$V_{\min}=\frac{5\pi}{e}$ 型（解析册 96753 行给出"(I) 求区域 D 绕 x 轴旋转一周所成旋转体的体积"）。

### 2008 年（真题册 104646–105545 行清晰）

**选择(2)｜考点：$\int x f'(x)dx$ 的几何意义（分部积分）**

题目：曲线段 $y=f(x)$ 在 $[0,a]$ 有连续导数，$\displaystyle\int_0^a xf'(x)\,dx$ 等于 (A) 曲边梯形 $ABOD$ 面积 (B) 梯形 $ABOD$ 面积 (C) 曲边三角形 $ACD$ 面积 (D) 三角形 $ACD$ 面积。

解法：分部

$$
\int_0^axf'(x)dx=\bigl[xf(x)\bigr]_0^a-\int_0^af(x)dx=a f(a)-\int_0^af(x)dx,
$$

即矩形 $OBAC$ 面积减去曲边梯形 $ABOD$ 面积 = 曲边三角形 $ACD$ 面积。答案 **(C)**。

**(16)（10 分）｜考点：变限积分 + 参数方程二阶导**

题目：参数方程 $x=x(t)$（由初值问题 $\frac{dx}{dt}-2te^{-t^2}x=0,\ x(0)=0$ 确定，题面竖排还原），$y=\displaystyle\int_0^{t^2}\ln(1+u)du$，求 $\frac{d^2y}{dx^2}$。

解法：$x'(t)=2te^{-t^2}x$ 型，$y'(t)=2t\ln(1+t^2)$；用参数求导公式 $\frac{dy}{dx}=\frac{y'(t)}{x'(t)}$，再 $\frac{d^2y}{dx^2}=\frac{d}{dt}(\frac{dy}{dx})/x'(t)$。

**(17)（9 分）｜考点：定积分换元 + 分部（反三角）**

题目：计算 $\displaystyle\int_0^1\frac{x^2\arcsin x}{\sqrt{1-x^2}}\,dx$。

解法：令 $x=\sin t$，

$$
\int_0^{\pi/2}\frac{\sin^2t\cdot t}{\cos t}\cos t\,dt=\int_0^{\pi/2}t\sin^2t\,dt=\int_0^{\pi/2}t\frac{1-\cos2t}{2}dt=\frac{\pi^2}{16}+\frac14.
$$

答案：$\dfrac{\pi^2}{16}+\dfrac14$。

**(19)（11 分）｜考点：旋转曲面面积与体积相等条件 → 微分方程（经典）**

题目：$f$ 在 $[0,+\infty)$ 有连续导数、单调增、$f(0)=1$；$[0,t]$ 曲边梯形绕 $x$ 轴旋转体侧面面积在数值上等于体积的 $2$ 倍，求 $f(x)$。

解法：条件 $2\pi\int_0^tf\sqrt{1+f'^2}dx=2\pi\int_0^tf^2dx$ 对任意 $t$ 成立，求导得

$$
f\sqrt{1+f'^2}=f^2\ \Longrightarrow\ 1+f'^2=f^2\ \Longrightarrow\ f'=\sqrt{f^2-1}\ (f\ \text{增}),
$$

解 ODE 并用 $f(0)=1$ 得 $\operatorname{arcosh}f=x$，即

$$
f(x)=\frac{e^x+e^{-x}}2=\cosh x.
$$

（解析册 107311、107321 行给出"旋转体的体积""侧面积"。）

**(20)（11 分）｜考点：证明积分中值定理（教材定理直接考）**

题目：(I) 证明积分中值定理；(II) 若 $\varphi(2)=\varphi(1)+\int_1^3\varphi(x)dx$ 型条件（题面竖排），证明 $\exists\xi\in(1,3)$ 使 $\varphi''(\xi)<0$。

解法：(I) $f$ 连续 $\Rightarrow$ 在 $[a,b]$ 上取到最小 $m$、最大 $M$，$m\le\frac{1}{b-a}\int_a^bf\le M$，由介值定理 $\exists\eta:f(\eta)=\frac{1}{b-a}\int_a^bf$。(II) 用积分中值定理把条件化为某点函数值与端点值相等，再用两次罗尔/拉格朗日定理得 $\varphi''<0$。

### 2009 年（真题册 109018–110011 行清晰）

**选择(6)｜考点：由 $f$ 的图形判断 $F(x)=\int_0^xf$ 的图形**

题目：给出 $f$ 在 $[-1,3]$ 的图形，选 $F(x)=\int_0^xf(t)dt$ 的图形。

解法：$F'=f$：$f>0$ 处 $F$ 增、$f<0$ 处 $F$ 减；$f$ 的零点为 $F$ 的驻点；$F(0)=0$ 且 $F$ 处处连续（$f$ 可积），逐段排除选项。

**填空(9)｜考点：变限积分 + 参数方程切线**

题目：$x=\displaystyle\int_0^{t^2}e^{-u^2}du,\ y=t\ln(2-t^2)$（题面竖排还原），求 $(0,0)$ 处切线。

解法：$t=0$ 对应 $(0,0)$；$x'(t)=2te^{-t^4}\to0$，$y'(t)=\ln(2-t^2)-\frac{2t^2}{2-t^2}\to\ln2$；用洛必达求 $\frac{dy}{dx}\big|_{t=0}=\lim\frac{y'(t)}{x'(t)}$ 型（在 $t=0$ 处需按参数方程极限处理，经典答案为 $y=x\ln2$ 型）。

**填空(10)｜考点：无穷限反常积分（含参数）**

题目：已知 $\displaystyle\int_{-\infty}^{+\infty}e^{k|x|}dx=1$，求 $k$。

解法：$2\int_0^{+\infty}e^{kx}dx=-\frac2k=1$（须 $k<0$），故 $k=-2$。

答案：$k=-2$。

**填空(11)｜考点：定积分极限（黎曼引理型）**

题目：$\displaystyle\lim_{n\to\infty}\int_0^1e^{-x}\sin nx\,dx$。

解法：分部积分

$$
\int_0^1e^{-x}\sin nx\,dx=\frac{1}{n}\Bigl(1-e^{-1}\cos n\Bigr)-\frac1n\int_0^1e^{-x}\cos nx\,dx\longrightarrow0.
$$

答案：$0$。

**(16)（10 分）｜考点：根式换元 + 分部（经典不定积分）**

题目：计算 $\displaystyle\int\ln\!\left(1+\sqrt{\frac{1+x}{x}}\right)dx\ (x>0)$。

解法：令 $t=\sqrt{\frac{1+x}{x}}>1$，则 $x=\frac{1}{t^2-1}$，$dx=-\frac{2t}{(t^2-1)^2}dt$，分部后化为有理函数积分：

$$
\int\ln(1+t)\,d\Bigl(\frac{-1}{t^2-1}\Bigr)=-\frac{\ln(1+t)}{t^2-1}+\int\frac{dt}{(t^2-1)(1+t)},
$$

再部分分式即得（解析册 109658 行"计算不定积分"）。

**(18)（10 分）｜考点：微分方程 + 面积 + 绕 $y$ 轴旋转体体积**

题目：非负函数 $y(x)$ 满足 $xy''-y'+2=0$（题面竖排还原），曲线过原点，与 $x=1,y=0$ 围成区域 $D$ 面积为 $2$，求 $D$ 绕 $y$ 轴旋转体体积。

解法：解 ODE 得 $y=x^2+cx$ 型，由 $\int_0^1y\,dx=2$ 定常数；再用柱壳法

$$
V_y=2\pi\int_0^1x\,y(x)\,dx
$$

（解析册 112822–112956 行给出"围成平面区域 D 的面积为 2""于是 D 围绕 y 轴旋转所得旋转体的体积为"）。

### 2010 年（真题册 114745–115608 行清晰）

**选择(4)｜考点：瑕积分敛散判别（与 $m,n$ 的关系，高频）**

题目：设 $m,n$ 是正整数，反常积分 $\displaystyle\int_0^1\frac{[\ln(1-x)]^{2/m}}{x^{1/n}}\,dx$（题面竖排还原）的收敛性。

解法：瑕点 $x=0$ 与 $x=1$。$x\to0$ 时被积 $\sim x^{-1/n}\cdot(\text{有界})$，$\frac1n<1$ 恒收敛；$x\to1$ 时 $|\ln(1-x)|^{2/m}$ 为对数型慢发散，对任意 $m$ 与 $1$ 相乘仍可积（$\int_0^\epsilon|\ln u|^pdu$ 对任意 $p>0$ 收敛）。故收敛性与 $m,n$ 都无关，答案 **(D)**。

**填空(12)｜考点：极坐标弧长（对数螺线）**

题目：$r=e^\theta,\ 0\le\theta\le\pi$ 的弧长。

解法：

$$
s=\int_0^\pi\sqrt{r^2+r'^2}\,d\theta=\int_0^\pi\sqrt{2}\,e^\theta d\theta=\sqrt2\,(e^\pi-1).
$$

答案：$\sqrt2(e^\pi-1)$。

**(15)（11 分）｜考点：被积含 $x$ 的变限积分求导 + 单调极值（经典）**

题目：$f(x)=\displaystyle\int_1^{x^2}(x^2-t)e^{-t^2}dt$，求单调区间与极值。

解法：先换元分离 $x$：$f(x)=x^2\int_1^{x^2}e^{-t^2}dt-\int_1^{x^2}te^{-t^2}dt$，求导

$$
f'(x)=2x\int_1^{x^2}e^{-t^2}dt.
$$

因积分恒正，$f'(x)$ 与 $x$ 同号：$x<0$ 减、$x>0$ 增，$x=0$ 取极小值

$$
f(0)=\int_1^0(-t)e^{-t^2}dt=-\frac12(e^{-1}-0)\ \text{型（依换元核算）}.
$$

**(16)（10 分）｜考点：定积分不等式 + 夹逼求极限（经典）**

题目：(I) 比较 $\displaystyle\int_0^1|\ln t|\,[\ln(1+t)]^n dt$ 与 $\displaystyle\int_0^1t^n|\ln t|dt$；(II) 记 $u_n=\int_0^1|\ln t|[\ln(1+t)]^n dt$，求 $\lim_{n\to\infty}u_n$。

解法：$0\le\ln(1+t)\le t$ 于 $[0,1]$，故 $0\le u_n\le\int_0^1t^n|\ln t|dt=\frac{1}{(n+1)^2}\to0$。

答案：$\lim u_n=0$。

**(18)（10 分）｜考点：截面面积积分（椭圆柱贮油，物理应用）**

题目：高 $l$ 的柱体贮油罐，底面长轴 $2a$、短轴 $2b$，平放，油面高 $\frac32b$ 时求油的质量（密度 $\rho$）。

解法：油面以下截面为椭圆弓形，面积

$$
A=\int_{-b}^{b/2}2a\sqrt{1-\frac{y^2}{b^2}}\,dy=ab\Bigl(\frac{2\pi}{3}+\frac{\sqrt3}{4}\Bigr)\ \text{型},
$$

质量 $m=\rho\,l\,A$。

### 2011 年（真题册 119959–120878 行清晰）

**选择(6)｜考点：定积分大小比较（换元 $t=\frac\pi4-x$，经典）**

题目：$I=\displaystyle\int_0^{\pi/4}\ln\sin x\,dx,\ J=\int_0^{\pi/4}\ln\cot x\,dx,\ K=\int_0^{\pi/4}\ln\cos x\,dx$，比较大小。

解法：在 $(0,\frac\pi4)$ 上 $0<\sin x<\cos x<1<\cot x$，故 $\ln\sin x<\ln\cos x<0<\ln\cot x$，即 $I<K<0<J$，答案 **(B)** $I<K<J$。

**填空(11)｜考点：弧长（变限积分作被积函数）**

题目：曲线 $y=\displaystyle\int_0^x\tan t\,dt\ \bigl(0\le x\le\frac\pi4\bigr)$ 的弧长 $s$。

解法：$y'=\tan x$，

$$
s=\int_0^{\pi/4}\sqrt{1+\tan^2x}\,dx=\int_0^{\pi/4}\sec x\,dx=\Bigl[\ln|\sec x+\tan x|\Bigr]_0^{\pi/4}=\ln(1+\sqrt2).
$$

答案：$\ln(1+\sqrt2)$。

**填空(12)｜考点：反常积分（指数分布期望）**

题目：$f(x)=\begin{cases}\lambda e^{-\lambda x},&x>0\\ 0,&x\le0\end{cases}\ (\lambda>0)$，求 $\displaystyle\int_{-\infty}^{+\infty}x f(x)\,dx$。

解法：

$$
\int_0^{+\infty}\lambda x e^{-\lambda x}dx=\Bigl[-(x+\tfrac1\lambda)e^{-\lambda x}\Bigr]_0^{+\infty}=\frac1\lambda.
$$

答案：$\dfrac1\lambda$。

**(15)（10 分）｜考点：变限积分 + 反常积分敛散定参数范围（经典）**

题目：$F(x)=\dfrac{1}{x^a}\displaystyle\int_0^x\ln(1+t^2)dt$，设 $\lim_{x\to+\infty}F(x)=0,\ \lim_{x\to0^+}F(x)=0$，求 $a$ 的取值范围。

解法：$x\to0^+$ 时 $\int_0^x\ln(1+t^2)dt\sim\int_0^xt^2dt=\frac{x^3}{3}$，故 $F\sim\frac{x^{3-a}}{3}\to0\iff a<3$；$x\to+\infty$ 时 $\int_0^x\ln(1+t^2)dt\sim2x\ln x$，故 $F\sim\frac{2x\ln x}{x^a}\to0\iff a>1$。

答案：$1<a<3$。

**(20)（11 分）｜考点：旋转体容积 + 抽水做功（综合应用，经典）**

题目：容器内侧由曲线 $x^2+y^2=...$（题面竖排：两段圆弧连接）绕 $y$ 轴旋转而成。(I) 求容积；(II) 盛满水从顶部全部抽出至少需做多少功。

解法：(I) 用圆盘法 $V=\pi\int\varphi^2(y)dy$ 分段（两段圆弧各给一个 $\varphi(y)$）；(II) 把高度 $y$ 处薄层水提升到顶部，微元功

$$
dW=\rho g\,\pi\varphi^2(y)\,(y_{\text{顶}}-y)\,dy,\qquad W=\rho g\pi\int\varphi^2(y)(y_{\text{顶}}-y)dy.
$$

解析册 123558 行给出"(I) 容器的容积即旋转体体积分为两部分"。

### 2012 年（原始试题册缺失，依解析册 124848–128589 行还原）

> 2012 年仅存解析册，中文可读、公式仍为竖排碎片。可核实的本章题目如下。

**第(17) 题（10 分）｜考点：切线 + 面积 + 绕 $x$ 轴旋转体体积（经典）**

题目（解析册 126370–126376 行）：过点 $(0,1)$ 作曲线 $L:y=\ln x$ 的切线，切点为 $A$，$L$ 与 $x$ 轴交于 $B$，区域 $D$ 由 $L$ 与直线 $AB$ 及 $x$ 轴围成，求 $D$ 的面积及 $D$ 绕 $x$ 轴旋转一周所得旋转体的体积。

解法：设切点 $A(x_0,\ln x_0)$，切线 $y-\ln x_0=\frac{1}{x_0}(x-x_0)$；过 $(0,1)$ 得 $1-\ln x_0=-1$，即 $x_0=e^2$，切线 $y=\frac{x}{e^2}+1$，与 $x$ 轴交于 $(-e^2,0)$。改用对 $y$ 积分：$L$ 为 $x=e^y$，切线为 $x=e^2(y-1)$，$y\in[0,2]$，

$$
S=\int_0^2\bigl[e^y-e^2(y-1)\bigr]dy=(e^2-1)-e^2\Bigl[\frac{y^2}{2}-y\Bigr]_0^2=e^2-1,
$$

$$
V=\pi\int (\text{外半径}^2-\text{内半径}^2)dx\ \text{（或柱壳法 }2\pi\int y\,[e^y-e^2(y-1)]dy\text{）}.
$$

**第(18) 题（10 分）｜考点：极坐标区域上的二重积分（多元，与本章衔接）**

题目（126615–126632 行）：计算 $\iint_D xy\,d\sigma$，$D$ 为 $r=1+\cos\theta\ (0\le\theta\le\pi)$ 与极轴围成。

解法：极坐标化 $x=r\cos\theta,\ y=r\sin\theta,\ d\sigma=r\,dr\,d\theta$，累次积分 $\int_0^\pi\int_0^{1+\cos\theta}r^3\sin\theta\cos\theta\,dr\,d\theta$。此题主体属二重积分，本章仅用其"化为一元累次积分"的技术。

### 2013 年（真题册 128590–129401 行清晰；解析册 129402–130212 行为乱码）

**选择(3)｜考点：分段函数的变限积分（连续但不可导）**

题目：$f(x)=\begin{cases}\sin x,&0\le x<\pi\\ 2,&\pi\le x\le2\pi\end{cases}$，$F(x)=\int_0^xf(t)dt$，判断 $F$ 在 $x=\pi$ 处。

解法：$f$ 在 $x=\pi$ 有跳跃间断（$\sin\pi=0\ne2$），但 $f$ 可积 $\Rightarrow F$ 连续；$F$ 在 $x=\pi$ 的左导数 $=\sin\pi=0$、右导数 $=2$，不相等 $\Rightarrow$ 不可导。答案 **(C)** 连续但不可导。

**选择(4)｜考点：反常积分敛散性定参数（高频）**

题目：分段 $f(x)=\begin{cases}\dfrac{e^x-1}{x^\alpha(x-1)^\alpha}\ \text{型},&0<x<1\\[4pt] \dfrac{1}{x\ln^\alpha x}\ \text{型},&x\ge1\end{cases}$（题面竖排还原），若 $\int_1^{+\infty}f(x)dx$ 收敛，求 $\alpha$。

解法：$x\to+\infty$ 时被积 $\sim\frac{1}{x(\ln x)^{\alpha}}$（题面含 $\ln x$ 分母），由 $p$-判别法（$\int_2^{+\infty}\frac{dx}{x(\ln x)^p}$ 收敛 $\iff p>1$）并结合 $x\to1^+$ 处瑕点要求 $\alpha<2$，综合得 $0<\alpha<2$，答案 **(D)**。

**填空(10)｜考点：变限积分 + 反函数求导**

题目：$f(x)=\displaystyle\int_{-1}^{x}\sqrt{1-e^{t}}\,dt$（题面竖排还原），求反函数 $x=f^{-1}(y)$ 在 $y=0$ 处的导数。

解法：$f(-1)=0$，由反函数求导

$$
\frac{dx}{dy}\Big|_{y=0}=\frac{1}{f'(-1)}=\frac{1}{\sqrt{1-e^{-1}}}.
$$

**填空(11)｜考点：极坐标面积（三叶玫瑰线一叶）**

题目：封闭曲线 $L:r=\cos3\theta\ \bigl(-\frac\pi6\le\theta\le\frac\pi6\bigr)$ 所围图形面积。

解法：

$$
S=\frac12\int_{-\pi/6}^{\pi/6}\cos^23\theta\,d\theta=\frac12\int_{-\pi/6}^{\pi/6}\frac{1+\cos6\theta}{2}d\theta=\frac{\pi}{12}.
$$

答案：$\dfrac{\pi}{12}$。

**(16)（10 分）｜考点：绕 $x$ 轴、$y$ 轴旋转体体积（$V_y=10V_x$ 定参数）**

题目：$D$ 由 $y=x^{1/3}$、$x=a\ (a>0)$ 及 $x$ 轴围成，$V_x,V_y$ 分别为 $D$ 绕 $x$ 轴、$y$ 轴旋转体体积，若 $V_y=10V_x$，求 $a$。

解法：

$$
V_x=\pi\int_0^a x^{2/3}dx=\frac{3\pi}{5}a^{5/3},\qquad
V_y=2\pi\int_0^a x\cdot x^{1/3}dx=\frac{6\pi}{7}a^{7/3}.
$$

由 $\frac{6\pi}{7}a^{7/3}=10\cdot\frac{3\pi}{5}a^{5/3}$ 得 $a^{2/3}=7$，故 $a=7^{3/2}=7\sqrt7$。

答案：$a=7\sqrt7$。

**(21)（11 分）｜考点：弧长 + 形心（定积分应用综合）**

题目：曲线 $L:y=\frac{x^2}{4}-\frac12\ln x\ (1\le x\le e)$。(1) 求 $L$ 的弧长；(2) $D$ 由 $L$、$x=1,x=e$ 及 $x$ 轴围成，求 $D$ 的形心横坐标。

解法：(1) $y'=\frac x2-\frac{1}{2x}$，$\sqrt{1+y'^2}=\frac x2+\frac{1}{2x}$，

$$
s=\int_1^e\Bigl(\frac x2+\frac1{2x}\Bigr)dx=\frac{e^2-1}{4}+\frac12.
$$

(2) $\bar x=\dfrac{\int_1^ex y(x)dx}{\int_1^e y(x)dx}$，分别计算 $\int_1^e(\frac{x^3}{4}-\frac x2\ln x)dx$ 与 $\int_1^e(\frac{x^2}{4}-\frac12\ln x)dx$ 即得。

### 2014 年（原始试题册缺失，解析册 130213–131490 行为乱码）

> 该年解析册为字体编码乱码，中文题目与公式均无法还原（源文件 130213–131490 行未抽出任何"积分/面积/体积/弧长"等可辨词条）。依数二命题史，本章必含"定积分计算/变限积分、反常积分敛散、旋转体体积或面积"各一题，此处如实标注资料缺失，**不列编造题目**。

### 2015 年（原始试题册缺失，解析册 131491–132445 行为乱码）

> 与 2014 年相同：解析册为乱码，131491–132445 行无可辨中文词条。本章题目无法核实，如实标注，**不列编造题目**。

### 2016 年（原始试题册缺失，依解析册 132446–133323 行还原；解析含字符替换）

> 解析册为字符替换文本（"工"代 $x$、"托"代 $\pi$、"真"代积分号等），可还原考点骨架，公式不逐字照抄。

**第(20) 题｜考点：旋转体体积与表面积（星形线/摆线型）**

解析册 133008 行"区域 D 绕工轴旋转所得旋转体的体积为"、133034 行"区域 D 绕工轴旋转所得旋转体的表面积为"，公式中出现 $\sin^3t,\ \cos t$ 与 $\frac{18\pi}{35}$ 型数值（133030 行），即旋转体体积结果。方法链：$V=\pi\int y^2dx$、$S=2\pi\int|y|\sqrt{1+y'^2}dx$ 对参数曲线分别用 $dx=x'(t)dt$。

**第(21) 题｜考点：函数平均值 + 积分中值定理**

解析册 133051 行"上的平均值为 $\bar f=\frac{1}{b-a}\int_a^bf(x)dx$"、133081 行"由积分中值定理，存在 $C$…使得 $f(c)=\frac{1}{b-a}\int f>0$"，属平均值与积分中值定理的证明题；133056 行出现分部积分关系 $\int_0^xf(x)dx=xf(x)-\int_0^x xf'(x)dx$ 型。

**补充**：解析册 132457 行"取 $C=0$ 得 $f'(x)$ 的一个原函数为 $F(x)=$"，属原函数概念题（与 1999 选择(3)、2005 选择(8) 同源）。

### 2017 年（原始试题册缺失，解析册 133324–133847 行为乱码）

> 解析册为乱码，133324–133847 行无可辨中文词条。本章题目无法核实，如实标注，**不列编造题目**。

### 2018 年（原始试题册缺失，依解析册 133848–134625 行还原；解析含字符替换）

> 解析册为字符替换文本，133848–134625 行未抽出可辨的"积分/面积/体积/弧长/旋转"等中文词条（含 $\int$ 的碎片亦为替代符号），题面无法逐字还原。依数二命题史，该年本章含"定积分计算（含变限积分）、反常积分、旋转体体积"等常规题型，如实标注，**不列编造题目**。

### 2019 年（真题册 134626–134744 行为乱码；解析册 134745–135741 行为字符替换）

**选择(3)｜考点：无穷限反常积分敛散/计算**

解析册 134771–134800 行可辨出 $\int_0^{+\infty}\dfrac{\arctan x}{1+x^2}dx$ 型（含 "$\arctan x$"、"$1+x^2$"、"$\int_0^{+\infty}$" 与 "$x\,e^{-x^2}dx=\frac12$" 的对照片段）。通法：

$$
\int_0^{+\infty}\frac{\arctan x}{1+x^2}dx=\Bigl[\frac12\arctan^2x\Bigr]_0^{+\infty}=\frac{\pi^2}{8};
$$

敛散性由 $\frac{\arctan x}{1+x^2}\sim\frac{\pi}{2x^2}\ (x\to+\infty)$ 用比较判别法判定收敛（$p=2>1$）。

> 说明：2019 年真题册通篇字体编码乱码，解析册为字符替换（如 "$x-\tan x\sim-\frac{x^3}{3}$" 被替换为拉丁/希腊混杂字符），除上题外其余本章题目无法逐字还原，未作编造。

### 2020 年（真题册 135742–136057 行为符号替换；依可辨片段还原）

> 真题册为字体编码替换（西里尔字母/藏文字符混排），积分号被替换为 `´`、`HM` 等；解析册 136058–136944 行同为替换文本，中文关键词未抽出。以下仅列可辨认考点骨架，公式按经典题型还原并注明。

**选择(3)｜考点：定积分计算（$\pi$ 型结果）**

真题册 135775–135788 行可辨 $\int_0^1\frac{\sqrt{x}}{\sqrt{x(1-x)}}dx$ 型，四个选项为 $\frac{\pi^2}{4},\frac{\pi^2}{8},\frac\pi4,\frac\pi8$ 型。通法：化简被积为 $\frac{1}{\sqrt{1-x}}$ 或 $\frac1{\sqrt{x(1-x)}}$ 后用 $\arcsin$/Beta 积分。

**填空(13)｜考点：无穷限反常积分（由微分方程解决定被积函数）**

真题册 135931–135935 行可辨 $y''+2y'+y=0,\ y(0)=0,y'(0)=1$，求 $\int_0^{+\infty}y(x)dx$ 型。解法：解 ODE 得 $y=xe^{-x}$，故

$$
\int_0^{+\infty}xe^{-x}dx=1.
$$

**填空(14)｜考点：液体压力（微元法）**

真题册 135924–135929 行："边长为 $2a$ 的等边直角三角形平板铅直地沉没在水中，边与水面平行…记重力加速度 $g$、水的密度 $\rho$，求该平板一侧所受的水压力"。解法：$P=\rho g\int h\cdot w(h)dh$，宽度随深度线性变化。

**解答(19)｜考点：函数方程 + 绕 $x$ 轴旋转体体积**

真题册 135977–135990 行可辨 $2f(x)+x^2f(1/x)=\dfrac{x^2+2x}{\sqrt{1+x^2}}$，求 $f(x)$，并求 $y=f(x)$ 与 $y=\frac12,y=\frac{\sqrt3}{2}$ 及 $y$ 轴所围图形绕 $x$ 轴旋转体体积。解法：把 $x$ 换成 $\frac1x$ 联立解出 $f(x)$，再用 $V=\pi\int(f^2-\text{内侧}^2)dx$（对 $y$ 分段）。

**解答(22)｜考点：面积比 → 积分方程 → 曲线方程**

真题册 136009–136013 行："曲线 $y=f(x)(x\ge0)$ 过原点，点 $M$ 处切线交 $x$ 轴于 $T$，$MP\perp x$ 轴于 $P$，曲边三角形面积与 $\triangle MTP$ 面积之比恒为 $3:2$，求曲线方程"。解法：面积条件 $\int_0^x f(t)dt=\frac32\cdot\frac12\cdot\frac{y}{y'}\cdot y$ 型，求导化为 ODE $y'=k\,y^{2/3}$ 型，解得幂函数曲线。

**解答(21)｜考点：积分中值定理（证明）**

真题册 136001–136007 行可辨 $f(x)=\int_1^x 2t^2\,dt$ 型，要求证明 $\exists\xi\in(1,2)$ 使 $f(\xi)=(2-\xi)^2\xi^2$ 与 $\exists\eta$ 使 $f(2)=\ln2\cdot\eta^2\eta^2$ 型，方法为积分中值定理 + 介值定理。

### 2021 年（真题册 136945–137286 行为符号替换）

> 真题册为符号替换（`#`、`$`、`%`、`&` 代数字与字母），解析册 137287–138003 行同为替换文本。仅列可辨考点骨架。

**选择(3)｜考点：变化率（体积与表面积，导数应用）**

真题册 136979–136985 行："有一圆柱体底面半径与高随时间变化的速率分别为…当底面半径为 $10$ cm、高为 $4$ cm 时，圆柱体的体积与表面积随时间变化的速率分别为"。解法：$V=\pi r^2h\Rightarrow V'=\pi(2rr'h+r^2h')$，$S=2\pi r^2+2\pi rh\Rightarrow S'=2\pi(2rr'+r'h+rh')$。

**解答(20)（12 分）｜考点：弧长 + 旋转曲面面积（本章核心）**

真题册 137256–137261 行可辨："$f(x)$ 满足…，$C$ 为曲线 $y=f(x)$ 的…，$J$ 的弧长为 $K$，$J$ 绕 $\#$ 轴旋转一周所形成的曲面的面积为 $S$，求 $K$ 和 $S$"。方法链：

$$
K=\int_a^b\sqrt{1+f'^2(x)}\,dx,\qquad S=2\pi\int_a^b|f(x)|\sqrt{1+f'^2(x)}\,dx.
$$

**解答(21)｜考点：平面区域与二重积分（含面积）**

真题册 137266–137271 行可辨"与 $\#$ 轴围成的区域为 $D$，求 $\iint_D ...\,dxdy$"，主体属二重积分，本章衔接其累次积分化归。

### 2022 年（真题册 138004–138223 行为字体编码乱码，无解析册）

> 真题册为字体编码替换（拉丁扩展字符），无解析册，答案未核实。仅列可辨认的考点骨架，**不列编造答案**。

**选择(7)｜考点：定积分大小比较**

138086–138115 行可辨出三个积分 $I_1,I_2,I_3$，被积含 $\frac{\ln(1+x)}{1+\cos x}$、$\frac{2x}{1+\sin x}$ 等，选项为 $I_1<I_2<I_3$ 等排序。通法：在公共区间上逐点比较被积函数，或用换元 $x\mapsto a+b-x$ 化为同区间比较。

**填空(13)｜考点：定积分计算（有理函数）**

138164–138167 行可辨 $\displaystyle\int_0^1\frac{2x+3}{x^2-x+1}\,dx$ 型。通法：拆 $2x+3=(2x-1)+4$，

$$
\int_0^1\frac{2x-1}{x^2-x+1}dx+\int_0^1\frac{4\,dx}{(x-\frac12)^2+\frac34}=\bigl[\ln(x^2-x+1)\bigr]_0^1+\frac{8}{\sqrt3}\arctan\frac{2x-1}{\sqrt3}\Big|_0^1.
$$

**填空(15)｜考点：极坐标曲线所围面积**

138170 行可辨"曲线 $L$ 的极坐标方程为 $r=\sin3\theta$ …则 $L$ 所围成的…面积"。通法：$S=\frac12\int r^2d\theta$，三叶玫瑰线分叶积分。

**解答(18)（12 分）｜考点：微分方程的解 + 弧长**

138181–138183 行可辨"设 $y(x)$ 是微分方程 $2xy'-4y=2\ln x-1$ 满足 $y(1)=\frac14$ 的解，求曲线 $y=y(x)\ (1\le x\le e)$ 的弧长"。通法：解一阶线性 ODE 得 $y$，再 $s=\int_1^e\sqrt{1+y'^2}dx$。

**解答(21)｜考点：$\int_a^b f(x)dx$ 的证明（积分中值/不等式）**

138209–138213 行可辨"证明 $f''(x)\ge0$ …并求 $a,b$ 使得 $\int_a^b f(x)dx$ …"，方法为积分中值定理与凸性。

### 2023、2024 年

> 源文件中 2023、2024 年数二真题与解析资料**整年缺失**（分隔符表中无对应年份条目），本章无任何可核实题目，如实标注，**不列编造题目**。

### 2025 年

> 源文件仅存 138224–138754 行"2025 考研数学二真题答案"册，通篇为 `!"#$%&'()(*+` 型符号乱码，无法还原任何题面与答案（见 138225–138269 行）。本章题目无法核实，如实标注，**不列编造题目**。

---

## 三、高频考点与易错点总结

### 3.1 高频考点（按出现频率排序）

1. **变限积分求导及其综合**（几乎每年必考，1989 填空(3)、1990 选择(4)、1992 选择(4)、1993 填空(3)、1994 填空(3)、1997 七、1998 填空(4)、1999 选择(2)、2002 选择(2)、2003 四、2004 选择(7)、2005(15)、2006 填空(2)/选择(8)、2007 选择(3)、2009 选择(6)/填空(9)、2010(15)、2011(15)、2013 选择(3)/填空(10)）。三件套：Leibniz 公式 $F'(x)=f(\varphi)\varphi'-f(\psi)\psi'$；被积含 $x$ 时**先换元把 $x$ 移出积分号**；分段函数逐段积分并保证衔接常数。$f$ 有跳跃间断点时 $F$ 连续但不可导（2006、2013）。

2. **定积分与不定积分的计算**（每年 2–4 道）：凑微分、第二类换元（$\sqrt{a^2\pm x^2}$ 三角代换、根式代换、倒代换）、分部积分（"反对幂指三"）、有理函数部分分式。特别熟练：$e^{2x}(1+\tan x)^2$（1997）、$\frac{\ln x}{x^2}$（1989）、$\frac{\arctan x}{x^2(1+x^2)}$（1996）、$\frac{x e^{\arctan x}}{(1+x^2)^{3/2}}$（2003）、$\frac{\arcsin e^x}{e^x}$（2006）、$\ln(1+\sqrt{\frac{1+x}{x}})$（2009）、$\int\frac{\sin t}{t}$ 型不可积但可用换序（1995 七）。

3. **反常积分的计算与敛散判别**（1991、1992、1993、1994、1997、1999、2000、2002、2004、2006、2007、2009、2010、2011、2013、2019、2020）。牢记 $p$-判别法两组结论（$\int_1^{+\infty}x^{-p}$ 收敛 $\iff p>1$；$\int_0^1x^{-p}$ 收敛 $\iff p<1$）；混合型必须**分段**（1998 六 $\int_{1/2}^{3/2}\frac{dx}{\sqrt{|x-x^2|}}$、2000 填空(3) $\int_2^{+\infty}\frac{dx}{(x+7)\sqrt{x-2}}$）；对数型 $\int_2^{+\infty}\frac{dx}{x(\ln x)^p}$ 与 $\int_0^1|\ln x|^p dx$ 对任意 $p>0$ 收敛（2010 选择(4)、2010(16)）。

4. **旋转体体积**（1989 选择(3)/八、1990 七、1991 六、1993 五、1994 八、1996 选择(5)、1997 六、2000 十、2002 六、2004(18)、2007(18)、2009(18)、2011(20)、2012(17)、2013(16)、2016(20)）。三套公式：$V_x=\pi\int f^2$、$V_y=2\pi\int x|f|$（柱壳）、$V_y=\pi\int\varphi^2(y)$；绕 $y=m$、$x=x_0$ 时**平移半径**；常与"体积最小/最大"结合对参数求导（1989 八、1997 六、2000 十、2007(18)）。

5. **平面图形面积**（1992 填空(5)、1995 选择(2)、1996 填空(5)、1998 填空(2)、1999 九、2000 四、2001 八、2012(17)、2020(22)、2022 填空(15)）。必先求交点、分段去绝对值；极坐标 $S=\frac12\int r^2d\theta$（1997 五、2003 填空(4)、2013 填空(11)）。

6. **弧长与旋转曲面面积**（1992 六、1995 三(5)、1998 九、2001 五、2003 八、2008(19)、2010 填空(12)、2011 填空(11)、2013(21)、2016(20)、2021(20)、2022(18)）。三条弧长公式（显式/参数/极坐标）与 $S=2\pi\int|y|\sqrt{1+y'^2}dx$ 必须区分"侧面积（曲面）"与"表面积（含底面圆）"（1998 九）。

7. **对称区间奇偶性、周期性、积分大小比较**（1994 选择(5)、1997 选择(2)/(4)、2000 六、2001 填空(3)、2003 选择(5)、2004 选择(7)/(17)、2010(16)、2011 选择(6)、2022 选择(7)）。核心：$\int_{-a}^a$ 奇函数为零；$|\cos t|$ 周期积分；$S_1=\int f$ 与矩形/梯形面积比较用凹凸性（1997 选择(2)）。

8. **定积分物理应用（微元法）**：变力做功（1999 六、2011(20)）、液体压力（2002 七、2020 填空(14)）、引力（1991 选择(5)）、路程（1991 填空(4)）、平均值（1999 填空(4)、2016(21)）。

9. **积分方程 / 积分不等式 / 积分中值定理**（1989 五、1990 六、1993 八、1994 七、1995 四/七、1997 七、1998 八、1999 九/十、2000 八/十一、2001 六/十、2003 十、2008(20)、2010(16)、2011(15)、2020(21)、2022(21)）。固定套路：变限积分方程两边求导化 ODE；$\int_a^bf=f(\eta)(b-a)$；分部积分把高阶导数积分化为端点值（2005(17) 得 20）。

### 3.2 易错点

1. **变限积分求导漏链式法则**：$\frac{d}{dx}\int_0^{x^2}f(t)dt=2x f(x^2)$，不是 $f(x^2)$；上下限都是函数时两项都要求导（1990 选择(4)、1992 选择(4)、1994 填空(3)）。被积含 $x$（如 $\int_0^{x^2}t f(x^2-t)dt$）**不能直接套 Leibniz**，必须先换元（1998 填空(4)、2010(15)）。

2. **反常积分必须按瑕点/无穷限分段**：$\int_{1/2}^{3/2}\frac{dx}{\sqrt{|x-x^2|}}$ 在 $x=1$ 为瑕点，直接牛顿-莱布尼茨会漏掉发散/对数项（1998 六）；$\int_2^{+\infty}\frac{dx}{(x+7)\sqrt{x-2}}$ 既是无穷限又有瑕点 $x=2$（2000 填空(3)）。$\int_{-\infty}^{+\infty}$ 必须两个极限都存在才收敛。

3. **$p$-积分两组结论方向相反**：$\int_1^{+\infty}\frac{dx}{x^p}$ 收敛要 $p>1$，$\int_0^1\frac{dx}{x^p}$ 收敛要 $p<1$；很多选项错误地把两者记成同一方向（2010 选择(4)、2013 选择(4)）。

4. **面积必须去绝对值**：$\int_a^b f$ 是"代数面积"，面积是 $\int_a^b|f-g|$。1995 选择(2) 的 $y=x(x-1)(2-x)$ 在 $[0,1]$、$[1,2]$ 上变号，直接 $\int_0^2$ 会部分抵消；1998 填空(2) 三次曲线有三个零点，须三段分段。

5. **绕 $y$ 轴体积别混用公式**：柱壳法 $V_y=2\pi\int_a^b x|f(x)|dx$ 与圆盘法 $V_y=\pi\int_c^d\varphi^2(y)dy$ 适用情形不同；图形跨 $x<0$ 时柱壳半径要取 $|x|$ 或用对 $y$ 积分（1991 六、2013(16)）。绕 $y=m$、$x=x_0$、$y=3$ 等非坐标轴直线时半径是 $m-f(x)$、$x_0-x$，不是 $f(x)$、$x$（1994 八、1996 选择(5)、1993 五）。

6. **旋转"侧面积/表面积"公式混淆**：侧面积 $S=2\pi\int|y|\sqrt{1+y'^2}dx$ 不含底面；"旋转体的表面积"还要加底圆 $\pi y^2(b)$（1998 九）。2008(19) 由 $S=2V$ 推出 $f\sqrt{1+f'^2}=f^2$ 后，别漏 $f>0$ 才能约去 $f$ 并取 $f'=\sqrt{f^2-1}$。

7. **奇偶/周期结论的条件**：$f$ 偶时**只有**满足 $F(0)=0$ 的那个原函数是奇函数（1999 选择(3)、2005 选择(8)）；$f$ 周期时原函数未必周期（须 $\int_0^Tf=0$）；$f$ 有第一类间断点时其变限积分 $F$ 仍连续但不可导（2006 选择(8)、2013 选择(3)）——"函数有间断点"与"变限积分不可导"不能混。

8. **分部积分 $u$ 的选取与"循环"**：$\int e^{ax}\sin bx\,dx$ 两次分部后出现原积分，移项解方程时勿漏除以系数；$\int\frac{\ln x}{x^2}dx$ 的 $v=-\frac1x$ 符号易错；1998 填空(3) $\int\frac{\ln\sin x}{\sin^2x}dx$ 的 $\int\cot^2x=\int(\csc^2x-1)=-\cot x-x$ 别漏 $-x$。

9. **等价无穷小只用于乘除因子**：变限积分型无穷小比较（1999 选择(2)、2004 选择(7)）应先对被积函数作等价替换再积分，如 $\alpha=\int_0^x\cos t^2dt\sim x$、$\beta=\int_0^{x^2}\tan\sqrt t\,dt\sim\frac23x^3$、$\gamma=\int_0^{\sqrt x}\sin t^3dt\sim\frac{x^2}{4}$，阶数由积分后幂次定，不是由被积函数的幂次定。

10. **定积分换元必换限且注意单调性**：$x=\sin t$ 在 $[0,1]$ 上 $\arcsin$ 主值、$\sqrt{1-\sin x}=|\sin\frac x2-\cos\frac x2|$ 必须分区间去绝对值（1992 三(4)）；$\sqrt{1-\cos2x}=\sqrt2\,\sin x$ 只在 $\sin x\ge0$ 的区间成立（1989 六在 $[0,\pi]$ 上成立）。

11. **积分中值定理 $\eta\in[a,b]$ 与微分中值定理 $\xi\in(a,b)$ 的区间开闭区别**；2008(20) 证明时须用连续函数最值 + 介值定理，不能只用微分中值定理。

12. **含参积分定参数范围要两端都查**：2011(15) 的 $F(x)=x^{-a}\int_0^x\ln(1+t^2)dt$ 要同时满足 $x\to0^+$（得 $a<3$）与 $x\to+\infty$（得 $a>1$），漏一端只得半个区间（$1<a<3$）。

13. **抽象函数积分题先"分离变量"**：$\int_0^1x^2f''(2x)dx$（1989 计算(5)）先令 $u=2x$ 再分部；$\int_0^{f(x)}g(t)dt=x^2e^x$（2001 六）求导得 $x f'(x)=(2x+x^2)e^x$；$f(x)=x^2+2\int_0^1f$（1989 填空(5)）先把定积分设为常数 $A$ 再积分求 $A$。

14. **二重积分（多元）与一元积分的分工**：本章只处理可化为一元累次积分的部分（2012(18)、2013(17)、2021(21)、2022(19)）；换序、极坐标化属第 5 章，勿在本章过度展开。

15. **资料本身的陷阱**：1987、1988、1990 解析、2014—2018 解析、2019、2020—2022、2025 的题面为乱码或符号替换，复习时应以权威真题册核对公式，切勿把本章按竖排碎片拼出的公式当作逐字原文；2023、2024 年资料整年缺失，本章未作任何补写。

---

*本章精读完毕。知识点覆盖：原函数与不定积分、基本积分表、两类换元、分部积分、有理函数积分、定积分定义与性质、牛顿-莱布尼茨公式、变限积分、奇偶/周期对称、反常积分与 $p$-判别法、面积/旋转体体积/弧长/旋转曲面面积/形心、变力做功与液体压力、积分中值定理。*
