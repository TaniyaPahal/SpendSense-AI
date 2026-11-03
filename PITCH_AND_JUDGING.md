# SpendSense — updated prototype pitch and judge notes

## 90-second pitch
Good morning respected judges.

Our project is **SpendSense — Financial clarity, finally.**

Students often manage a limited allowance, but small everyday purchases are easy to forget. At the end of the month, many know their money is gone but cannot explain where it went.

SpendSense turns those small money moves into clear decisions.

Users can create a personal demo account, log income and expenses, see category-wise spending, set a monthly budget and track savings goals. Our explainable insight engine identifies spending patterns and suggests practical next steps — like setting a weekly food limit or pausing before a non-essential purchase.

The key idea is not simply recording expenses. It is helping students understand the next choice they can make.

This prototype keeps data in the browser and does not connect to bank accounts. The current insight engine is rule-based; a production version could add an opt-in language model with proper privacy and security controls.

**SpendSense: Financial clarity, finally.**

Thank you.

## Demo flow
1. Choose Continue with demo account.
2. Add expense: `Late-night food delivery`, ₹450, Expense, Food.
3. Show dashboard metrics and category chart update.
4. Open AI insights and explain the suggestion.
5. Change budget to ₹10,000 and save.
6. Create a savings goal: `New headphones`, target ₹4,000, saved ₹500.
7. Open AI Assistant and ask where the biggest spending category is.
8. Open Predictions, Split Expenses and Analytics to show the extra tools.
9. Open Profile, change display name or monthly budget, then demonstrate Sign out.

## Judge Q&A

**Q: Is sign-in secure?**  
A: The hackathon build demonstrates the user journey locally. It is not production authentication. A real release requires a secure backend, password hashing, HTTPS, session controls and recovery.

**Q: Is this real AI?**  
A: This prototype uses transparent local pattern-based analysis. It does not call a live LLM. We prioritized a working offline demo and explainable outputs.

**Q: Does it connect to UPI or bank accounts?**  
A: No. Entries are manually added. Financial integrations would require consent, secure regulated providers and strong privacy controls.

**Q: What makes it different from an expense tracker?**  
A: It connects transaction tracking with student-oriented budget caps, explainable prompts and goal progress, focusing on what action the user can take next.

**Q: Who is the target audience?**  
A: Students and young adults who want a calm, simple way to understand spending and build savings habits.

## Honest limitations
- Sample data is illustrative.
- Sign-in is simulated in browser localStorage.
- Passwords are not securely hashed in this prototype; do not use real credentials.
- No bank sync, payment initiation or financial advice.
- Local insights are rule-based, not a live LLM.

## One-hour team plan
- 0–10 min: Open site, test sign-up and demo login.
- 10–20 min: Test add transaction, budgets and goals.
- 20–30 min: Prepare five slides.
- 30–45 min: Rehearse the demo and judge Q&A.
- 45–55 min: Check responsive view and reset sample demo.
- 55–60 min: Keep the browser on dashboard and ZIP as backup.
