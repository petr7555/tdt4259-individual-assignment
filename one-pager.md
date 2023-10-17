# One pager
<!--
4 main points
-->

## Intent

<!--
What’s the problem we’re trying to solve, or the opportunity we want to gain from? How will customers benefit? Why are we doing this, and why is it important?
Why
Why is this document important? Often framed around the problem or opportunity we want to address, and the expected benefits. Also, Why now? Describe it simply in their terms: customer benefits, business gains, productivity improvements.
-->

In the last few months, FunPay registered a significant increase in the number of fraudulent credit card transactions. All these frauds were reported by the users as the company does not have any fraud detection system in place. In most cases, the company had to refund the money to the users. In the other cases, the users lost their money.
The company is looking for a solution to detect and prevent these fraudulent transactions. This will benefit both the company and its users financially, and it will improve users' trust in the company.

## Desired outcome

<!--
What should we measure? How well should we solve this problem?
What
What are the measures of success and constraints. Enable readers to evaluate and decide on proposals, make trade-offs, and provide feedback. What are the business and technical requirements?
-->

The outcome of this project is a service that detects whether a credit card transaction is fraudulent or not.
A balance needs to be found between its precision and recall. Allowing a fraudulent transaction is more costly than preventing it and having the user review it. Therefore, the underlying model should be optimized for recall, which should be at least 90%, i.e. missing at most one fraudulent transaction out of ten. The precision should be at least 95%.
The fraud detection will happen in real time. It is important not to noticeably slow down the payment process for the user. Therefore, the latency of the service should be below 800 ms.

## Deliverable

<!--
Design a deliverable that meets the intent and desired outcome. How should we solve this problem?
How
How you’ll achieve the Why and What. This includes methodology, high-level design, tech decisions, etc. It’s also useful to add how you’re *not* implementing it (i.e., out of scope)
-->

The deliverable is a model that classifies whether a credit card transaction is fraudulent or not.
It will be deployed as a web service in FunPay's private cloud, and it will be accessible only from the other company's systems.
will work with encoded data

Maybe not, let's say that internal team anonymizes the data, does PCA and then we can use public cloud.
Security is important
"• Security: Some platforms may fail to design access protocols. Should research the terms and conditions to clearly
understand how and where your data is going to be processed."
Transfer transaction data safely

## Constraints

<!--
How not to solve a problem is often more important than how to solve it (Business, technical, resource constraints).
-->

Data privacy is one of the fundamental values of FunPay. The user data must not leave  
Own solution should be developed. Third party solutions do not provide enough security. Furthermore, sending transactions data of the users to third party solutions is prohibited by the
• Lack of customization: Limited in functionality and it’s hard to adapt for more complex solutions.
own solution to get customizable solution

<!--
Who
Audience. Although *Who* may not show up as a section in the doc, it’ll influence how it turns out
(topics, depth, language).
You can think of the data science/engineer team as the audience for these documents.
-->
