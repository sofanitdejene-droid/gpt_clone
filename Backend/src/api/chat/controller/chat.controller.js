import { createConversationService } from "../service/chat.service.js";

import { getRecentConversationsRow } from "../service/chat.service.js";



export async function createConversationController(req, res) {
  try {
    // request body lay extract yemnaregew question new
      const { question } = req.body;
    //   questionachnen le service ensetalun

      const result = await createConversationService(question);
    //  for frontend
      res.status(201).json({
          success: true,
          message: "Conversation created successfully",
        //   actual value return enaregalun 
        data: result,
      });
      
  } catch (error) {
    throw error;
  }
}

export async function getConversationsController(req, res) {

  try {
      
    const result = await getRecentConversationsRow(100);
    res.status(200).json({
        success: true,
        message: "Conversations fetched successfully",
        data: result,
    });
  }

 catch (error){
         throw error;   
}


};
