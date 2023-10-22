# One pager
<!--
4 main points
-->

## Intent

<!--
What’s the problem we’re trying to solve, or the opportunity we want to gain from? How will customers benefit? Why are we doing this, and why is it important?

Why is this document important? Often framed around the problem or opportunity we want to address, and the expected benefits. Also, Why now? Describe it simply in their terms: customer benefits, business gains, productivity improvements.
-->

In the last few months, FunPay registered a significant increase in the number of fraudulent credit card transactions. All these frauds were reported by the users as the company does not have any fraud detection system in place. In most cases, the company had to refund the money to the users. In the other cases, the users lost their money.

The company is looking for a solution to detect and prevent these fraudulent transactions. This will benefit both the company and its users financially, and it is expected to improve users' trust in the company.

## Desired outcome

<!--
What should we measure? How well should we solve this problem?

What are the measures of success and constraints. Enable readers to evaluate and decide on proposals, make trade-offs, and provide feedback. What are the business and technical requirements?
-->

Being able to detect and prevent fraudulent credit card transactions is expected to increase the company revenue in multiple ways. First, the company will not have to refund the money to the users – the cost of refunds to the users should decrease by at least 60%.
Second, the company will be more credible to the users, and the number of new users as well as number of daily active users should increase.

Important metrics of the system are precision and recall. A balance needs to be found between those two. Allowing a fraudulent transaction is more costly than preventing it and having the user review it. Therefore, the system should be optimized for recall, which should be at least 90%, i.e. missing at most one fraudulent transaction out of ten. The precision should be at least 95%.

The fraud detection will happen in real time. It is important not to noticeably slow down the payment process for the user. Therefore, the latency of the service should be below 800 ms.

## Deliverable

<!--
Design a deliverable that meets the intent and desired outcome. How should we solve this problem?

How you’ll achieve the Why and What. This includes methodology, high-level design, tech decisions, etc. It’s also useful to add how you’re *not* implementing it (i.e., out of scope)
-->

The deliverable is a model that classifies whether a credit card transaction is fraudulent or not. It will be deployed as a web service in FunPay's private cloud, and it will be accessible only from the other company's systems. The existing payment processing system will be modified to call the fraud detection service before completing the credit card transaction.

The model will be trained on the historical data of credit card transactions. The data will be anonymized before training using PCA.

The model will be trained using the [Pycaret](https://pycaret.org/) library. It will be deployed using [FastAPI](https://fastapi.tiangolo.com/) and [Docker](https://www.docker.com/).

## Constraints

<!--
How not to solve a problem is often more important than how to solve it (business, technical, resource constraints).
-->

FunPay does not have a dedicated data science team. Therefore, the solution should be easy to develop and operate.

Security and data privacy are one of the fundamental values of FunPay. The system must be accessible only by other FunPay systems and must not use personal identifiable information.

Own solution is preferred to third party solutions due to the ability to customize the solution later specifically for the company's needs.

<!--
Audience. Although *Who* may not show up as a section in the doc, it’ll influence how it turns out (topics, depth, language).
You can think of the data science/engineer team as the audience for these documents.
-->
