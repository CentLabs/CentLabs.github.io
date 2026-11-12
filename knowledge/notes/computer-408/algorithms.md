---
title: 重要算法整理
category: computer-408
source: 【04】计算机408/408笔记/重要算法整理.docx
---

# 重要算法整理

> 来源：`【04】计算机408/408笔记/重要算法整理.docx`

请默写顺序表插入结点算法（P15）

#define MaxSize 100			//定义线性表的最大长度

#define Elemtype int			//定义线性表元素数据类型

typedef struct{

ElemType data[MaxSize];	//顺序表的元素

int length;				//顺序表的当前长度

}SeqList;						//顺序表的静态定义

bool ListInsert(SqlList &L, int i, ElemType e)

//本算法实现将元素e插入到顺序表L中的第i个位置

int j;

if(i<1||i>L.length+1)		//判断i的范围是否有效

return false;

if(L.length>=MaxSize)		//当前存储空间已满，不能插入

return false;

for(j=L.length;j>=i;j--)		//将第i个元素及之后元素后移

L.data[j]=L.data[j-1];

L.data[i-1]=e;				//在位置i处放入

L.length++;				//线性表长度加1

return true;

}

请默写顺序表删除结点算法（P16）

#define MaxSize 100			//定义线性表的最大长度

#define Elemtype int			//定义线性表元素数据类型

typedef struct{

ElemType data[MaxSize];	//顺序表的元素

int length;				//顺序表的当前长度

}SeqList;						//顺序表的静态定义

bool ListDelete(SqlList &L, int i, ElemType &e)

//本算法实现将元素e插入到顺序表L中的第i个位置

int j;

if(i<1||i>L.length)			//判断i的范围是否有效

return false;

e=L.data[i-1];				//将被删除的元素赋值给e

for(j=i;j<L.length;j++)		//将第i个位置之后元素前移

L.data[j-1]=L.data[j];

L.length--;				//线性表长度减1

return true;

}

请默写链表头插算法。（P27）

typedef struct LNode{			//定义单链表结点类型

ElemType data;			//数据域

struct LNode *next;			//指针域

}LNode, *Linklist;

Linklist CreateList_head(LinkList &L){

//从表尾到表头逆向建立单链表L，每次均在头结点之后插入元素

LNode *s;

ElemType x;

L=(LinkList)malloc(sizeof(LNode));			//创造头结点

L->next=NULL;							//初始为空链表

scanf(“%d”,&x);						//输入结点的值

while(x!=9999){						//输入9999表示结束

s=(LNode*)malloc(sizeof(LNode));		//创建新结点

s->data=x;

s->next=L->next;

L->next=s;						//将新结点插入表中，L为头指针

scanf(“%d”,&x);

}									//while结束

return L;

}

请默写链表尾插算法。（P28）

typedef struct LNode{			//定义单链表结点类型

ElemType data;			//数据域

struct LNode *next;			//指针域

}LNode, *Linklist;

Linklist CreateList_rear(LinkList &L){

//从表头到表尾正向建立单链表L，每次均在表尾插入元素

LNode *s,*r;

ElemType x;

L=(LinkList)malloc(sizeof(LNode));

r=L;									//r为表尾指针

scanf(“%d”,&x);						//输入结点的值

while(x!=9999){						//输入9999表示结束

s=(LNode*)malloc(sizeof(LNode));

s->data=x;

r->next=s;

r=s;								//r指向新的表尾结点

scanf(“%d”,&x);

}									//while结束

r->next=NULL;							//尾结点指针置空

return L;

}

请默写链表插入算法。（P29）

p=GetElem(L,i-1);

s->next=p->next;

p->next=s;

请默写链表删除算法。（P30）

p=GetElem(L,i-1);

q=p->next;

p->data=q->next;

free(q);

请默写二叉树先序遍历非递归算法。（P116）

typedef struct BiNode{

ElemType data;						//数据域

struct BiTNode *lchild, *rchild;			//左、右孩子指针

}BiTNode,*BiTree;

void PreOrder(BiTree T){

//二叉树先序遍历的非递归算法，算法需要借助一个栈

BiTree p=T;

InitStack(S);							//初始化栈；p是遍历指针

while(p||!isEmpty(S)){					//栈不空或p不空时循环

if(p){								//若结点非空则先访问父节点

visit(p);

Push(S,p);					//再入栈

p=p->lchild;					//再访问左子树

}

else{								//若结点为空再出栈访问右子树

Pop(S,p);

p=p->rchild;

}

}

}

请默写二叉树中序遍历非递归算法。（P116）

typedef struct BiNode{

ElemType data;						//数据域

struct BiTNode *lchild, *rchild;			//左、右孩子指针

}BiTNode,*BiTree;

void InOrder(BiTree T){

//二叉树先序遍历的非递归算法，算法需要借助一个栈

BiTree p=T;

InitStack(S);							//初始化栈；p是遍历指针

while(p||!isEmpty(S)){					//栈不空或p不空时循环

if(p){								//若结点非空则先入栈

Push(S,p);

p=p->lchild;					//再访问左子树

}

else{								//若结点为空先出栈访问父节点

Pop(S,p);

visit(p);

p=p->rchild;					//再访问右子树

}

}

}

请默写二叉树后序遍历非递归算法。（P130）

typedef struct BiNode{

ElemType data;						//数据域

struct BiTNode *lchild, *rchild;			//左、右孩子指针

}BiTNode,*BiTree;

void PostOrder(BiTree T){

BiTree p=T,r=NULL;

InitStack(S);

while(p||!isEmpty(S)){

if(p){								//走到最左边

push(S,p);

p=p->lchild;

}

else{								//向右

GetTop(S,p);					//取栈顶元素

if(p->rchild&&p->rchild!=r){		//如果右子树存在，且未被访问过

p=p->rchild;				//转向右

push(S,p);				//压入栈

p=p->lchild;				//再走到最左

}

else{							//否则，弹出结点并访问

pop(S,p);					//将结点弹出

visit(p->data);				//访问该结点

r=p;						//记录最近访问过的结点

p=NULL;					//结点访问完后，重置p结点

}

}//else

}//while

}

请默写二叉树层次遍历算法。（P116）

typedef struct BiNode{

ElemType data;						//数据域

struct BiTNode *lchild, *rchild;			//左、右孩子指针

}BiTNode,*BiTree;

void LevelOrder(BiTree T){

BiTree p;

InitQueue(Q);							//初始化辅助队列

EnQueue(Q,T);						//将根节点入队

while(!IsEmpty(Q)){						//队列不空循环

DeQueue(Q,p);					//队头元素出队

visit(p);							//访问当前p所指结点

if(p->lchild!=NULL)

EnQueue(Q,p->lchild);			//左子树不空，则左子树入队列

if(p->rchild!=NULL)

EnQueue(Q,p->rchild);			//右子树不空，则右子树入队列

}

}

请默写二叉树中序遍历线索化递归算法。（P118）

typedef struct ThreadNode{

ElemType data;						//数据元素

struct ThreadNode *lchild,*rchild;			//左、右孩子指针

int ltag,rtag;							//左、右线索标志

}ThreadNode,*ThreadTree;

void InThread(ThreadTree &p,ThreadTree &pre){

if(p!=NULL){

InThread(p->lchild,pre);				//递归，线索化左子树

if(p->lchild==NULL){				//左子树为空，建立前驱线索

p->lchild=pre;

p->ltag=1;

}

if(pre!=NULL&&p->rchild!=NULL){

pre->rchild=p;					//建立前驱结点的后继线索

pre->rtag=1;

}

pre=p;							/标记当前结点成为刚刚访问过的结点

InThread(p->rchild,pre);				//递归，线索化右子树

}

}

void CreateInThread(ThreadTree T){

ThreadTree pre=NULL;

if(T!=NULL){							//非空二叉树，线索化

InThread(T,pre);					//线索化二叉树

pre->rchild=NULL;					//处理遍历后的最后一个结点

pre->rtag=1;

}

}

请默写二叉排序树非递归查找算法。（P153）

typedef struct BiNode{

ElemType data;						//数据域

struct BiTNode *lchild, *rchild;			//左、右孩子指针

}BiTNode,*BiTree;

BiTNode *BST_Search(BiTree T,ElemType key,BiTNode *&p){

//查找函数返回指向关键字值为key的结点指针，若不存在，返回NULL

p=NULL;//p指向被查找结点的双亲，用于插入和删除操作中

while(T!=NULL&&key!=T->data){

p=T;

if(key<T->data)T=T->lchild;

else T=T->rchild;

}

return T;

}

请默写二叉排序树插入算法。（P154）

typedef struct BiNode{

ElemType data;						//数据域

struct BiTNode *lchild, *rchild;			//左、右孩子指针

}BiTNode,*BiTree;

int BST_Insert(BiTree &T,ElemType k){

//在二叉排序树T中插入一个关键字为k的结点

if(T==NULL){							//原树为空，新插入的记录为根结点

T=(BiTree)malloc(sizeof(BiTNode));

T->key=k;

T->lchild=T->rchild=NULL;

return 1;							//返回1，表示成功

}

else if(k==T->key)						//树中存在相同关键字的结点

return 0;

else if(k<T->key)

return BST_Insert(T->lchild,k);		//插入到T的左子树中

else

return BST_Insert(T->rchild,k);		//插入到T的右子树中

}

请默写广度优先遍历（BFS）算法。（P196）

bool visited[MAX_VERTEX_NUM];				//访问标记数组

void BFSTraverse(Graph G){

//对图G进行广度优先遍历，设访问函数为visit()

for(i=0;i<G.vexnum;++i)

visited[i]=FALSE;					//访问标记数组初始化

InitQueue(Q);							//初始化辅助队列Q

for(i=0;i<G.vexnum;++i)					//从0号顶点开始遍历

if(!visited[i])						//对每个连通分量调用一次BFS

BFS(G,i);						//vi未访问过，从vi开始BFS

}

void BFS(Graph G,int v){

//从顶点v出发，广度优先遍历图G，算法借助一个辅助队列G

visit(v);								//访问初始顶点v

visited[v]=TRUE;						//对v做已访问标记

Enqueue(Q,v);							//顶点v入队列

while(!isEmpty(Q)){

Dequeue(Q,v);						//顶点v出队列

for(w=FirstNeighbor(G,v);w>=0;w=NextNeighbor(G,v,w))//检测v所有邻接点

if(!visited[w]){					//w为v的尚未访问的邻接顶点

visit(w);					//访问顶点w

visited[w]=TRUE;			//对w做已访问标记

EnQueue(Q,w);			//顶点w入队列

}

}

}

请默写深度优先遍历（DFS）算法。（P198）

bool visited[MAX_VERTEX_NUM];				//访问标记数组

void DSTraverse(Graph G){

//对图G进行深度优先遍历，设访问函数为visit()

for(i=0;i<G.vexnum;++i)

visited[i]=FALSE;					//访问标记数组初始化

for(i=0;i<G.vexnum;++i)					//从0号顶点开始遍历

if(!visited[i])						//对每个连通分量调用一次DFS

BFS(G,i);						//vi未访问过，从vi开始DFS

}

void BFS(Graph G,int v){

//从顶点v出发，深度优先遍历图G

visit(v);								//访问初始顶点v

visited[v]=TRUE;						//对v做已访问标记

for(w=FirstNeighbor(G,v);w>=0;w=NextNeighbor(G,v,w))//检测v所有邻接点

if(!visited[w]){					//w为v的尚未访问的邻接顶点

DFS(G,w);					//深度优先遍历顶点w

}//if

}

请默写折半查找算法。（P237）

int Binary_Search(SeqList L, ElemType key){

//在有序表L中查找关键字为key的元素，若存在则返回位置，不存在则返回-1；

int low=0,high=L.length-1,mid;

while(low<=high){

mid=(low+high)/2;				//取中间位置

if(L.elem[mid]==key)

return mid;				//查找成功则返回所在位置

else if(L.elem[mid]>key)

high=mid-1;				//从前半部分继续查找

else

low=mid+1;				//从后半部分续查找

}

return -1;

}

请默写KMP算法。（P269,P271）

void get_next(char T[],int next[]){

i=1;

next[1]=0;

j=0;

while(i<=T[0]){

if(j==0||T[i]==T[j]){				//T[0]用于保存字符串长度

++i;++j;next[i]=j;

}

else

j=next[j];

}//while

}

int KMP(char S[], char T[], int next[], int pos){

//利用模式串T的next函数求T在主串中第pos个字符之后的位置的KMP算法

//其中，T非空，1<=pos<=strlen(S)

i=pos;

j=1;

while(i<=S[0]&&j<=T[0]){

if(j==o||S[i]==T[j]){

++I;

++j;

}//if

else

j=next[j];

}//while

if(j>T[0])

return i=T[0];

else

return 0;

}

请默写直接插入排序算法。（P285）

void InsertSort(ElemType A[], int n){

int I,j;

for(i=2;i<=n;i++)			//依次将A[2]~A[n]插入到前面已排序序列

if(A[i].key<A[i-1].key){	//若A[i]的关键码小于其前驱，需将A[i]插入有序表

A[0]=A[i];			//复制为哨兵，A[0]不存放元素

for(j=i-1;A[0].key<A[j].key;--j)//从后往前查找待插入元素

A[j+1]=A[j];	//向后挪位

A[j+1]=A[0];		//复制到插入位置

}

}

请默写折半插入排序算法。（P286）

void InsertSort(ElemType A[],int n){

int I,j,low,high,mid;

for(i=2;i<=n;i++){			//依次将A[2]~A[n]插入到前面已排序序列

A[0]=A[i];				//将A[i]暂存到A[0]

low=1;

high=i-1;				//设置折半查找范围

while(low<=high){		//折半查找（默认递增有序）

mid=(low+high)/2;	//取中间点

if(A[mid].key>A[0].key)high=mid-1;	//查找左半字表

else low=mid+1;	//查找右半子表

}

for(j=i-1;j>=high+1;--j)

A[j+1]=A[j];		//统一后移元素，空出插入位置

A[high+1]=A[0];		//插入操作

}

}

请默写快速排序算法。（P291）

int Partition(ElemType A[],int low,int high){

ElemType pivot=A[low];	//将当前表中第一个元素设为枢轴值，对表进行划分

while(low<high){		//循环跳出条件

while(low<high&&A[high]>=pivot)—high;

A[low]=A[high];	//将比枢轴值小的元素移动到左端

while(low<high&&A[low]<=pivot)++low;

A[high]=A[low];	//将比枢轴值大的元素移动到右端

}

A[low]=pivot;			//枢轴元素存放到最终位置

return low;			//返回存放枢轴的最终位置

}

void QuickSort(ElemType A[],int low,int high){

if(low<high){							//递归跳出条件

//划分操作，将A[low…high]划分为满足上述条件的两个子表

int pivotpos=Partition(A,low,high);		//划分

QuickSort(A,low,pivotpos-1);			//依次对两个子表进行递归排序

QuickSort(A,pivotpos+1,high);

}

}

请默写选择排序算法。（P301）

void SelectSort(ElemType A[],int n){

//对表A作简单选择排序，A[]从0开始存放元素

for(i=0;i<n-1;i++){					//一共进行n-1趟

min=i;						//记录最小元素位置

for(j=i+1;j<n;j++)				//在A[i…n-1]中选择最小元素

if(A[j]<A[min])min=j;		//更新最小元素位置

if(min!=i)swap(A[i],A[min]);		//与第i个位置交换

}

}

请默写希尔排序算法。（P286）

void ShellSort(ElemType A[],int n){

//对顺序表作希尔插入排序，本算法和直接插入排序相比，作出了如下修改

//1.前后记录位置的增量是dk，不是1

//2.r[0]只是暂存单元，不是哨兵，当j<=0时，插入位置已到

for(dk=n/2;dk>=1;dk=dk/2)

for(i=dk+1;i<=n;++i)

if(A[i].key<A[i-dk],key){		//需将A[i]插入有序增量子表

A[0]=A[i];				//暂存在A[0]

for(j=i-dk;j>0&&A[0].key<A[j].key;j-=dk)

A[j+dk]=A[j];		//记录后移，查找插入的位置

A[j+dk]=A[0];			//插入

}

}

请默写二路归并排序算法。（P309）

ElemType *B=(ElemType *)malloc((n+1)*sizeof(ElemType));

void Merge(ElemType A[],int low, int mid, int high){

//表A的两段A[low…mid]和A[mid+1…high]各自有序，将它们合并成一个有序表

for(int k=low;k<=high;k++)

B[k]=A[k];					//将A中所有元素复制到B中

for(i=low,j=mid+1,k=i;i<=mid&&j<=high;k++){

if(B[i]<=B[j])					//比较B的左右两段中的元素

A[k]=B[i++];				//将较小值复制到A中

else

A[k]=B[j++]

}

while(i<=mid)		A[k++]=B[i++];		//若第一个表未检测完，复制

while(j<=high)		A[k++]=B[j++];		//若第二个表未检测完，复制

}

void MergeSort(ElemType A[],int low,int high){

if(low<high){

int mid=(low+high)/2;			//从中间划分两个子序列

MergeSort(A,low,mid);			//对左侧子序列进行递归排序

MergeSort(A,mid+1,high);		//对右侧子序列进行递归排序

Merge(A,low,mid,high);			//归并

}

}

请默写堆排序算法。（P302）

void BuildMaxHeap(ElemType A[], int len){

for(int i=len/2;i>0;i--);				//从i=[n/2]~1反复调整堆

AdjustDown(A,I,len);

}

void AdjustDown(ElemType A[],int k,int len){

//函数AdjustDown将元素k向下进行调整

A[0]=A[k];						//A[0]暂存

for(i=2*k;i<=len;i*=2){				//沿key较大的子结点向下筛选

if(i<len&&A[i]<A[i+1])

i++;						//取key较大的子结点的下标

if(A[0]>=A[i]) break;			//筛选结束

else{

A[k]=A[i];					//将A[i]调整到双亲结点上

k=I;						//修改k值，以便继续向下筛选

}

}//for

A[k]=A[0];						//被筛选结点的值放入最终位置

}

void HeapSort(ElemType A[],int len){

BuildMaxHeap(A,len);				//初始建堆

for(i=len;i>1;i--){					//n-1趟的交换和建堆过程

Swap(A[i],A[1]);				//输出堆顶元素（和堆底元素交换）

AdjustDown(A,1,i-1);			//整理，把剩余的i-1个元素整理成堆

}

}
