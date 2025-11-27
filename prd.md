# Prototoype Requirements Document

**Product:** Brief Creator.

**Audience:** Pharma companies preparing promotional and medical briefs for content creation.

**Objective of the Project:** Build a front end prototype that demonstrates a single happy path flow showing how the full application could look and behave.

**Users Point of View:** User who creates brief only (i.e. **Brief Creator** role), no other role is within scope of this prototype.

---

## 1. Purpose and scope

**Product intent**
Brief Creator helps pharma teams standardize, accelerate, and enrich the creation of content briefs by leveraging AI, before handoff to external teams. Briefs generated will be aligned with brand guidelines and compliance practices.

**Prototype scope for this project**

1. One smooth happy path for the Brief Creator.
2. High fidelity look and feel, navigation, and core interactions.
3. AI outputs, data, and approvals are mocked. No live integrations or backend.

**Out of scope for the prototype**
Downstream content production, real compliance checks, real user administration, real notifications, real analytics, real MLR validation, complex error handling.

---

## 2. Target users

**For the product**

1. **Brief Creator** role: Marketing Manager. This is the single creator persona in scope to avoid ambiguity.
2. **Strategist** role: Senior reviewer responsible for pre distribution approval.
3. **Admin** role: Can modify Brand Guidelines.

**For the prototype demo (i.e. scope of this project)**
Only the Brief Creator interacts. Strategist actions are simulated as outcomes the creator sees.

---

## 3. Demo flow happy path

Point of view is always the Brief Creator.

1. **Dashboard**  
   The homepage shows stats cards, recent briefs, and the Create New Brief action.

2. **Create brief**  
   The creator clicks on New Brief and completes the form. It then proceed to click Generate Brief with AI.

3. **Review and refine AI brief**  
   A pre-generated brief appears. The creator can edit fields, regenerate specific sections, approve sections, select references, export and save as draft

4. **Submit for AI review**  
   The creator clicks "Submit for AI Review" which triggers an immediate AI analysis of the brief content for completeness, messaging quality, and compliance.

5. **AI review results**  
   Within seconds, the AI provides positive feedback with a high quality score (8.5/10) and helpful suggestions like "Consider adding specific KPIs for social media engagement" and "Timeline looks comprehensive." The creator can accept suggestions or proceed as-is.

6. **Final submission**  
   The creator accepts the AI recommendations, makes any final adjustments, and submits the brief. The status changes to "AI-Reviewed" and the brief is ready for use.

7. **Dashboard confirmation**  
   The creator returns to the Dashboard where the brief now appears with "AI-Reviewed" status and a notification confirms successful completion of the brief creation process.

8. **Visit settings and Brand Guidelines control panel**  
   The creator shows that the way the content is generated depends on how the Brand Guidelines are set in its dedicated section (in read-only mode, since it is not an admin user).

---

## 4. Key features demonstrated in the prototype

1. AI brief generation using pre scripted inputs and outputs.
2. Editing and selective regeneration of sections.
3. Possibility to ask AI to automatically select references (pre scripted) and manually select/deselect references. 
4. Briefs have states "Draft" or "AI-Reviewed".
5. Homepage view with a few pre seeded briefs for realism and reuse.
6. Brand Guidelines section for configuring AI brief generation parameters (read-only).

---

## 5. Success criteria for the demo

1. The happy path is smooth and understandable without narration.
2. Stakeholders clearly see how a Marketing Manager can generate, refine, submit, receive AI feedback and submit.
3. The prototype communicates near final visual quality and basic interaction fidelity.
4. No time based transitions. Scenario advances only through explicit creator actions.

---

## 6. Technical notes

1. React and Next.js frontend.
2. State with Zustand.
3. Mock data for brands, channels, personas, and pre generated AI sections in JSON.
4. Simulated persistence in memory or local storage during the session. The demo resets to initial state on refresh.
5. Notifications are mocked and appear when returning to the Dashboard after submission or resubmission.
6. Accessibility basics respected in the prototype views.
