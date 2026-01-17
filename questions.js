// npm i mongodb
const { MongoClient } = require('mongodb');

(async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI);
    await client.connect();
    const col = client.db('userguide').collection('questions');

    const scrapedDocs = [
      {
        "title": "Smart Audit User Guidance",
        "link": "https://scribehow.com/page/Smart_Audit_User_Guidance__F8eDSHW7S7i5HV6kfK0xAA?referrer=documents"
      },
      {
        "title": "Smart Audit - How can we extend the NC due date",
        "link": "https://scribehow.com/viewer/Smart_Audit__How_can_we_extend_the_NC_due_date__AJKbEGOdSWe0JhPt_u3nsA?referrer=documents"
      },
      {
        "title": "Smart Audit-Difference between list & button type response?",
        "link": "https://scribehow.com/page/Smart_Audit-Difference_between_list_and_button_type_response__sBOmXIK1R3CT4A9tZ0WB-w?referrer=documents"
      },
      {
        "title": "Smart Audit: Creating Audit Workflow",
        "link": "https://scribehow.com/viewer/Smart_Audit_Creating_Audit_Workflow__MmKFpYZwQpKWHE2dr_1r6g?referrer=documents"
      },
      {
        "title": "Smart Audit and Smart IAM - What to do if the user does not appear in the Auditee dropdown",
        "link": "https://scribehow.com/viewer/Smart_Audit_and_Smart_IAM__What_to_do_if_the_user_does_not_appear_in_the_Auditee_dropdown__qe6zJR8jSmiv-AFT92vkCQ?referrer=documents"
      },
      {
        "title": "Smart Audit - How to configure Audit Guidance for section headings, main questions, and conditional questions.",
        "link": "https://scribehow.com/viewer/Smart_Audit__How_to_configure_Audit_Guidance_for_section_headings_main_questions_and_conditional_questions__NufaGjYUSjKTuZnqE8w2JA?referrer=documents"
      },
      {
        "title": "Smart Audit- How to add a checklist?",
        "link": "https://scribehow.com/page/Smart_Audit_How_to_add_a_checklist__2UwQkzxSQweGeL9kZnYIbQ?referrer=documents"
      },
      {
        "title": "Smart Audit - Enable Section Summary in Smart Food Safe Audit",
        "link": "https://scribehow.com/viewer/Smart_Audit__Enable_Section_Summary_in_Smart_Food_Safe_Audit__GC7hZOd0SRKrNO0eNJY72A?referrer=documents"
      },
      {
        "title": "Smart Audit- Creating Audit record",
        "link": "https://scribehow.com/viewer/Smart_Audit_Creating_Audit_record__FJW2B31_RkCulv9_jVXAcg?referrer=documents"
      },
      {
        "title": "Smart Audit- Creating Template",
        "link": "https://scribehow.com/viewer/Smart_Audit_Creating_Template__0zgXdjWXRwO5Yei_BPnGYQ?referrer=documents"
      },
      {
        "title": "Smart Audit - Dashboard and its functionalities",
        "link": "https://scribehow.com/viewer/Smart_Audit__Dashboard_and_its_functionalities__YizRzxAaRu6uF_ZtO7NrJQ?referrer=documents"
      },
      {
        "title": "Smart Audit - Enable Scoring logic",
        "link": "https://scribehow.com/viewer/Smart_Audit__Enable_Scoring_logic__nby8uNecTmqZ-4iJAWz4sA?referrer=documents"
      },
      {
        "title": "Smart Audit- How to setup an audit result?",
        "link": "https://scribehow.com/page/Smart_Audit_How_to_setup_an_audit_result__krXWgU1dQSKeTb7VgkSTRw?referrer=documents"
      },
      {
        "title": "Smart Audit App-How to find Non conformances assigned",
        "link": "https://scribehow.com/page/Smart_Audit_App-How_to_find_Non_conformances_assigned__QqkzNsGiQgeQtPqBhCFPkA?referrer=documents"
      },
      {
        "title": "Smart Audit App - Record creation",
        "link": "https://scribehow.com/viewer/Smart_Audit_App__Record_creation__pSKv43VvTtmq6tc0Outaug?referrer=documents"
      },
      {
        "title": "Smart Audit App - Download the App and Login",
        "link": "https://scribehow.com/viewer/Smart_Audit_App__Download_the_App_and_Login__dT8G8r-WSMSdTdvprXrs-A?referrer=documents"
      },
      {
        "title": "Smart Audit App - Settings (Site, Language, Version, Log-out)",
        "link": "https://scribehow.com/viewer/Smart_Audit_App__Settings_Site_Language_Version_Log-out__O2FLBPktSh26tqrtOkhLVg?referrer=documents"
      },
      {
        "title": "Smart Audit - Configure Reminder Notifications",
        "link": "https://scribehow.com/viewer/Smart_Audit__Configure_Reminder_Notifications__bsOEC22gTgCUYirLTTjjNQ?referrer=documents"
      },
      {
        "title": "Smart Audit- Ways To Create A Template",
        "link": "https://scribehow.com/page/Smart_Audit_Ways_To_Create_A_Template__B9nOUsYqRiahb2gwJsgqBQ?referrer=documents"
      },
      {
        "title": "Smart Audit- Creating An Audit Checklist Using AI",
        "link": "https://scribehow.com/viewer/Smart_Audit_Creating_An_Audit_Checklist_Using_AI__3DdjE-x6TUqnBANObAIAmg?referrer=documents"
      },
      {
        "title": "Smart Audit- How to set up a validation?",
        "link": "https://scribehow.com/viewer/Smart_Audit_How_to_set_up_a_validation__I_pSg19zRBS4li1xxBHeSg?referrer=documents"
      },
      {
        "title": "Smart Audit- How to add a section?",
        "link": "https://scribehow.com/page/Smart_Audit_How_to_add_a_section__e_mSqT9FQm6irYmV4jcg3w?referrer=documents"
      },
      {
        "title": "Smart Audit- How to enable section summary? Why it is used?",
        "link": "https://scribehow.com/page/Smart_Audit_How_to_enable_section_summary_Why_it_is_used__Dnw1aNijTte8k7VoPI2jgw?referrer=documents"
      },
      {
        "title": "Smart Audit- How to add/delete a question?",
        "link": "https://scribehow.com/page/Smart_Audit_How_to_adddelete_a_question__U3LQSMtLRreqHs86ZqVr4A?referrer=documents"
      },
      {
        "title": "Smart Audit- How does the default response help?",
        "link": "https://scribehow.com/page/Smart_Audit_How_does_the_default_response_help__p3MBcziHTaW9tVG94CJylw?referrer=documents"
      },
      {
        "title": "Smart Audit- Why do we have multiple checklist option?",
        "link": "https://scribehow.com/page/Smart_Audit_Why_do_we_have_multiple_checklist_option__5dUrMKoIR4CoGf_C8i5X1Q?referrer=documents"
      },
      {
        "title": "Smart Audit- How to add a department & production line",
        "link": "https://scribehow.com/page/Smart_Audit_How_to_add_a_department_and_production_line__ZSIbAn1lQu2uLIn_gEHgGw?referrer=documents"
      },
      {
        "title": "Smart Audit: What are the different ways of creating a response?",
        "link": "https://scribehow.com/page/Smart_Audit_What_are_the_different_ways_of_creating_a_response__8cg8cpyoSR-RkKcRdSfy6w?referrer=documents"
      },
      {
        "title": "Smart Audit: Scheduling a template",
        "link": "https://scribehow.com/viewer/Smart_Audit_Scheduling_a_template__jOCc3ccvRbq6gnxjqwHh5g?referrer=documents"
      },
      {
        "title": "Smart Audit: Update Non-Conformances",
        "link": "https://scribehow.com/viewer/Smart_Audit_Update_Non-Conformances__Rkpk2JmmQRWL8B_MO0Qu-g?referrer=documents"
      },
      {
        "title": "Smart Audit- Assigning Non Conformance",
        "link": "https://scribehow.com/viewer/Smart_Audit_Assigning_Non_Conformance__pSAsWqaLQwioKjDnCUYd7w?referrer=documents"
      },
      {
        "title": "Smart Audit- Configure Audit Responses (List Type)",
        "link": "https://scribehow.com/viewer/Smart_Audit_Configure_Audit_Responses_List_Type__-5Nf4oGXR3CuHLkZyD14lA?referrer=documents"
      },
      {
        "title": "Smart Audit- Clone a Checklist in Audit Library",
        "link": "https://scribehow.com/viewer/Smart_Audit_Clone_a_Checklist_in_Audit_Library__h1f9NJPeQYiWVC9GEk6v2w?referrer=documents"
      },
      {
        "title": "Smart Audit- Create a Non-Conformance Workflow",
        "link": "https://scribehow.com/viewer/Smart_Audit_Create_a_Non-Conformance_Workflow__kpVIeSIyRaiB5lv2Vxx3rA?referrer=documents"
      },
      {
        "title": "Smart Audit- Configure Audit Response (Button Type)",
        "link": "https://scribehow.com/viewer/Smart_Audit_Configure_Audit_Response_Button_Type__gi-yaNUGRHuHclXZLLwKMQ?referrer=documents"
      }
    ];

    const ops = scrapedDocs.map(d => ({
      updateOne: {
        filter: { link: d.link },
        update: {
          $set: {
            title: d.title,
            source: d.source || 'scribehow',
            contentType: d.contentType || 'HTML',
            updatedAt: new Date(),
            normalizedTitle: d.title.toLowerCase().replace(/[^\w\s]/g,' ').replace(/\s+/g, ' ').trim()
          },
          $setOnInsert: { scrapedAt: new Date() }
        },
        upsert: true
      }
    }));

    await col.bulkWrite(ops);
    await client.close();
    console.log('Done!');
  } catch (err) {
    console.error('Error running questions script:', err);
    process.exit(1);
  }
})();
