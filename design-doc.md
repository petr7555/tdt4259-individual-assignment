# Design document

<style>
  ol {
    counter-reset: item;
  }
  ol > li {
    display: block;
  }
  ol > li:before {
    content: counters(item, ".") ". ";
    counter-increment: item;
  }
</style> 

## Table of contents

1. [Overview](#1-overview)
2. [Motivation](#2-motivation)
3. [Success metrics](#3-success-metrics)
4. [Requirements & Constraints](#4-requirements--constraints)
    1. [Functional requirements](#41-functional-requirements)
    2. [Non-functional requirements](#42-non-functional-requirements)
    3. [What is in-scope & out-of-scope?](#43-what-is-in-scope--out-of-scope)
    4. [What are our assumptions?](#44-what-are-our-assumptions)
5. [Methodology](#5-methodology)
    1. [Problem statement](#51-problem-statement)
    2. [Data](#52-data)
    3. [Techniques](#53-techniques)
    4. [Experimentation & Validation](#54-experimentation--validation)
    5. [Human-in-the-loop](#55-human-in-the-loop)
6. [Implementation](#6-implementation)
    1. [High-level design](#61-high-level-design)
    2. [Infra](#62-infra)
    3. [Performance (Throughput, Latency)](#63-performance-throughput-latency)
    4. [Security](#64-security)
    5. [Data privacy](#65-data-privacy)
    6. [Monitoring & Alarms](#66-monitoring--alarms)
    7. [Cost](#67-cost)
    8. [Integration points](#68-integration-points)
    9. [Risks & Uncertainties](#69-risks--uncertainties)
7. [Appendix](#7-appendix)
    1. [Alternatives](#71-alternatives)
    2. [Experiment Results](#72-experiment-results)
    3. [Performance benchmarks](#73-performance-benchmarks)
    4. [Milestones & Timeline](#74-milestones--timeline)
    5. [Glossary](#75-glossary)
    6. [References](#76-references)

<!--
# ml-design-doc

A template for design docs for machine learning systems based on this [post](https://eugeneyan.com/writing/ml-design-docs/).

Note: This template is a guideline / checklist and is **not meant to be exhaustive**. The intent of the design doc is to help you think better (about the problem and design) and get feedback. Adopt whichever sections—and add new sections—to meet this goal. View other templates, examples [here](#other-templates-examples-etc).

Purpose: to help the author think deeply about the problem and solution and get feedback.
-->

## 1. Overview

<!--
A summary of the doc's purpose, problem, solution, and desired outcome, usually in 3-5 sentences.
-->
FunPay is considering a new internal service that would help prevent credit card frauds. This document proposes and describes such service. It elaborates

## 2. Motivation

<!--
Why the problem is important to solve, and why now.
Why should we solve this problem? Why now?
Explain the motivation for your proposal and convince readers of its importance. What is the customer or business benefit? If you’re building a replacement system, explain why improvements to the existing system will not work as well. If there are alternatives, explain why your proposed system is better.
-->

In the last few months, FunPay registered a significant increase in the number of fraudulent credit card transactions. All these frauds were reported by the users as the company does not have any fraud detection system in place. In most cases, the company had to refund the money to the users. In the other cases, the users lost their money. The company is looking for a solution to detect and prevent these fraudulent transactions. This will benefit both the company and its users financially, and it will improve users' trust in the company.

## 3. Success metrics

<!--
What are the success criteria?
Usually framed as business goals, such as increased customer engagement (e.g., CTR, DAU), revenue, or reduced cost.
-->

According to the survey recently conducted by FunPay among existing users, credit card frauds were identified as a major concern by 60% of users. 20% of users had experienced a credit card fraud while using FunPay credit cards. It is expected that the addition of the automatic fraud detection results in more user trust, thus resulting in increased FunPay credit cards usage.

- Number of daily active users increases by at least 8%.
- Average number of credit card transactions per user per day increases by at least 10%.

Marketing this feature should also attract new users.

- Number of new users per month increases by at least 5%.

Most importantly, credit card frauds should be caught automatically, not relying on users reporting them after it is too late.

- At least 90% of credit card frauds should be caught automatically. I.e. the recall should be at least 90%.
- Number of user reported frauds decreases by at least 80%.
- Cost of refunds to the users decreases by at least 60%.
- Monetary loss of the users decreases by at least 60%.

It is important that the service does not consider valid transactions as fraudulent. The number of false positives should be kept low.

- The precision should be at least 95%.

Because the fraud detection will happen in real time, the service should not noticeably slow down the payment process for the user.

- The latency of the service should be less than 800 ms.

## 4. Requirements & Constraints

<!--
What are the requirements and constraints?
Functional requirements are those that should be met to ship the project. They should be described in terms of the customer perspective and benefit.
Non-functional/technical requirements are those that define system quality and how the system should be implemented. These include performance (throughput, latency, error rates), cost (infra cost, ops effort), security, data privacy, etc.
Constraints can come in the form of non-functional requirements (e.g., cost below $`x` a month, p99 latency < `y`ms)
-->

### 4.1 Functional requirements

- Credit card transactions which are found to be fraudulent are declined.
- Credit card transactions which are found to be valid are processes as usual.
- The recall is at least 90%.
- The precision is at least 95%.

### 4.2 Non-functional requirements

- Performance
    - The throughput of the service is at least 100 requests per second.
    - The service handles peaks of up to 1000 requests per second.
    - The P99 latency of the service is less than 800 ms.
    - The error rate of the service is less than 1%.
- Security & data privacy
    - The service is deployed in FunPay's private cloud.
    - The service is accessible only from the other company's systems.
    - The service does not store any data about the users or their transactions.
    - The service processes only numerical input variables which are the result of a PCA transformation and the transaction amount.
- Costs
    - The cost of the service is less than 0.001 EUR per transaction.

### 4.3 What is in-scope & out-of-scope?

<!--
Some problems are too big to solve all at once. Be clear about what's out of scope.
-->

The underlying model will be trained on a fixed set of data and a fixed number of features. When new data and/or features are obtained, the model will be re-deployed manually. This process will not be automated. There are two main reasons for this decision:

1. The service is in its early stages, and it is necessary to get user feedback first before allocating more resources into the development of more complicated solution.
2. Each new model needs to be thoroughly evaluated before being put into production.

### 4.4 What are our assumptions?

With 100 000 users making 10 transactions per day, it is expected that the average system load would be around 25 requests per second. It is also expected that the occasional peaks do not exceed 500 requests per second.

## 5. Methodology

### 5.1. Problem statement

<!--
How will you frame the problem? For example, fraud detection can be framed as an unsupervised (outlier detection, graph cluster) or supervised problem (e.g., classification).
-->

FunPay has a dataset of previous transactions which contains labels whether given transaction was fraudulent or not. Therefore, supervised approach will be used. The fraud detection will be framed as a binary classification task with the classes being fraudulent and non-fraudulent transaction.

Having high recall is more important than having high precision. FunPay wants to maximize caught fraud at the cost of more false alarms.

### 5.2. Data

<!--
Describe the data and entities your data science model will be using.
What data will you use to train your model? What input data is needed during serving?
-->

The dataset that will be used to train and evaluate the model is a collection of labeled transactions that FunPay processed in a span of two days. It contains 284 807 transactions in total, 492 of which are frauds (i.e. only 0.173%). This makes it a highly imbalanced dataset.

To comply with user data privacy, the original features have been transformed using PCA into 28 numerical floating point features, named V1,... , V28. Those are the principal components obtained with PCA.

The data also contain untransformed transaction amount (in EUR; floating point number) and the label (1 meaning fraudulent, 0 meaning valid). These are named "Amount" and "Class", respectively. The minimal amount is 0 (transactions that validate if credit card is valid), the maximal is 25691.16 EUR.

### 5.3. Techniques

<!--
Outline the data science techniques you’ll try/tried. Include baselines for comparison.
What machine learning techniques will you use? How will you clean and prepare the data (e.g., excluding outliers) and create features?
-->

The data science team has received the data already preprocessed from the product team. The dataset does not have any missing values. Therefore, no imputation techniques need to be used. The dataset might potentially contain some outliers. These will be removed using the Isolation Forest method. The dataset contains 29 features and the target variable. No further features need to be created.

Two baseline models should be included for comparison with more complicated models. One that classifies each transaction as non-fraudulent and the second one which uses Naive Bayes. Preliminary analysis has been conducted and machine learning models such as Random Forest Classifier and Logistic Regression seem to give good results. These models should be explored further. Lastly, it would be good to try solving the problem using neural networks.

### 5.4. Experimentation & Validation

<!--
Explain how you’ll evaluate models offline. Explain your choice of evaluation metrics(s).
How will you validate your approach offline? What offline evaluation metrics will you use?

If you're A/B testing, how will you assign treatment and control (e.g., customer vs. session-based) and what metrics will you measure? What are the success and [guardrail](https://medium.com/airbnb-engineering/designing-experimentation-guardrails-ed6a976ec669) metrics?
-->

#### 5.4.1 Before deployment

The data will be split into two parts. 70% will be used for training and 30% will be used for the final validation of the chosen model. To compare various models and their hyperparameters, the training data will be further split using stratified k-fold with 10 folds. This will result in multiple average cross-validated scores. The most relevant metrics are recall and precision. Because of the high class imbalance, accuracy is not a good metric. Area under the precision-recall curve (AUPRC) will be used instead.

TODO update after training finishes
Preliminary analysis shows that precision of 95% and recall of 79% are achievable.
The respective AUPRC was TODO.

#### 5.4.2 After deployment

False positives (when user had to manually allow a transaction that was considered fraudulent by the system) will be monitored.
Similarly, false negatives (when system detected a transaction as valid and user later raised a complaint on transaction being fraudulent) will also be monitored.
After 30 days of running this new system, these metrics will be evaluated and a decision will be made on whether the system meets the expectations.

### 5.5. Human-in-the-loop

<!--
How will you incorporate human intervention into your ML system (e.g., product/customer exclusion lists)?
-->

Users will be able to set a maximal amount, up to which the transactions will be automatically accepted. This amount cannot be larger than 100 EUR.

When a credit card transaction is considered fraudulent, users are notified. They can then review the transaction and if they find that it was a false positive, they can still allow it. Optionally, they can choose to consider also all future transactions from the given merchant as valid. This will minimize the inconvenience for the users.

## 6. Implementation

### 6.1. High-level design

![](https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Data-flow-diagram-example.svg/1280px-Data-flow-diagram-example.svg.png)

Start by providing a big-picture view. [System-context diagrams](https://en.wikipedia.org/wiki/System_context_diagram) and [data-flow diagrams](https://en.wikipedia.org/wiki/Data-flow_diagram) work well.

High-level design: Data stores, pipelines(e.g., data preparation,feature engineering, training), and serving.

### 6.2. Infra

How will you host your system? On-premise, cloud, or hybrid? This will define the rest of this section

Infra + scalability: List the infra options and your final choice.

### 6.3. Performance (Throughput, Latency)

How will your system meet the throughput and latency requirements? Will it scale vertically or horizontally?

### 6.4. Security

How will your system/application authenticate users and incoming requests? If it's publicly accessible, will it be behind a firewall?

Security: How you’ll secure your application and authenticate users and incoming requests.

### 6.5. Data privacy

How will you ensure the privacy of customer data? Will your system be compliant with data retention and deletion policies (e.g., [GDPR](https://gdpr.eu/what-is-gdpr/))?

Data privacy: How you’ll protect and ensure the privacy of customer data.

### 6.6. Monitoring & Alarms

How will you log events in your system? What metrics will you monitor and how? Will you have alarms if a metric breaches a threshold or something else goes wrong?

Monitoring + alarms: How you’ll monitor your system performance. List the alarms that will trigger human intervention (e.g., on-call)

### 6.7. Cost

How much will it cost to build and operate your system? Share estimated monthly costs (e.g., EC2 instances, Lambda, etc.)

Cost: Should include labour cost, cost of infrastructure, etc.

### 6.8. Integration points

How will your system integrate with upstream data and downstream users?

### 6.9. Risks & Uncertainties

Risks are the known unknowns; uncertainties are the unknown unknows. What worries you and you would like others to review?

Risks and uncertainties: Call them out to the best of your ability. This allows reviewers to help spot design flaws and rabbit holes, and provide feedback on how to avoid/addressthem.

## 7. Appendix

### 7.1. Alternatives

<!--
What alternatives did you consider and exclude? List pros and cons of each alternative and the rationale for your decision.

Other stuff: ops strategy (e.g., monitoring, on-call), model rollbacks, quality assurance, extensibility, and model footprint and power consumption (if used in mobile apps).
-->

Google Vertex AI – did not work, expensive

### 7.2. Experiment Results

Share any results of offline experiments that you conducted.

### 7.3. Performance benchmarks

Share any performance benchmarks you ran (e.g., throughput vs. latency vs. instance size/count).

### 7.4. Milestones & Timeline

What are the key milestones for this system and the estimated timeline?

### 7.5. Glossary

Define and link to business or technical terms.

### 7.6. References

<!--
Add references that you might have consulted for your methodology.
-->

This fictional design document is based on [Credit Card Fraud Detection dataset from Kaggle](https://www.kaggle.com/datasets/mlg-ulb/creditcardfraud/data).

https://eugeneyan.com/writing/ml-design-docs/
https://github.com/eugeneyan/ml-design-docs

---

## Other templates, examples, etc

- [A Software Design Doc](https://www.industrialempathy.com/posts/design-doc-a-design-doc/) `Google`
- [Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/) `Google`
- [Product Spec of Emoji Reactions on Twitter Messages](https://docs.google.com/document/d/1sUX-sm5qZ474PCQQUpvdi3lvvmWPluqHOyfXz3xKL2M/edit#heading=h.554u12gw2xpd) `Twitter`
- [Design Docs, Markdown, and Git](https://caitiem.com/2020/03/29/design-docs-markdown-and-git/) `Microsoft`
- [Technical Decision-Making and Alignment in a Remote Culture](https://multithreaded.stitchfix.com/blog/2020/12/07/remote-decision-making/) `Stitchfix`
- [Design Documents for Chromium](https://www.chromium.org/developers/design-documents) `Chromium`
- [PRD Template](https://works.hashicorp.com/articles/prd-template) and [RFC Template](https://works.hashicorp.com/articles/rfc-template) (example RFC: [Manager Charter](https://works.hashicorp.com/articles/manager-charter)) `HashiCorp`
- [Pitch for To-Do Groups and Group Notifications](https://basecamp.com/shapeup/1.5-chapter-06#examples) `Basecamp`
- [The Anatomy of a 6-pager](https://writingcooperative.com/the-anatomy-of-an-amazon-6-pager-fc79f31a41c9) and an [example](https://docs.google.com/document/d/1LPh1LWx1z67YFo67DENYUGBaoKk39dtX7rWAeQHXzhg/edit) `Amazon`
- [Writing for Distributed Teams](http://veekaybee.github.io/2021/07/17/p2s/), [How P2 Changed Automattic](https://ma.tt/2009/05/how-p2-changed-automattic/) `Automattic`
- [Writing Technical Design Docs](https://medium.com/machine-words/writing-technical-design-docs-71f446e42f2e), [Writing Technical Design Docs, Revisited](https://medium.com/machine-words/writing-technical-design-docs-revisited-850d36570ec) `AWS`
- [How to write a good software design doc](https://www.freecodecamp.org/news/how-to-write-a-good-software-design-document-66fcf019569c/) `Plaid`

Contributions [welcome](https://github.com/eugeneyan/ml-design-docs/pulls)!
