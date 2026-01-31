require('dotenv').config();
const express = require('express');
const OpenAI = require('openai');
const cors = require('cors');
const path = require('path'); // Import the 'path' module
const nodemailer = require('nodemailer');

const app = express();
const port = 3001;

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the root directory
app.use(express.static(path.join(__dirname)));

// --- API Routes ---

const predefinedResponses = {
  // Expanded greetings & basics
  'hello': "Hello! I'm MarkBot. Feel free to ask me anything about Mark Jan's portfolio, skills, or projects.",
  'hi': "Hi there! I'm MarkBot, ready to answer your questions about Mark Jan. What would you like to know?",
  'how are you': "I'm just a bunch of code, but I'm running perfectly! Thanks for asking. How can I help you learn about Mark Jan?",
  'help': "You can ask me about Mark Jan's 'skills', 'projects', 'experience', or how to 'contact' him. What are you interested in?",
  'resume': "You can download Mark Jan's resume using the 'Download Resume' button in the top section of the page.",
  'thank': "You're welcome! Is there anything else I can help you with?",
  'bye': "Goodbye! Have a great day exploring the portfolio.",

  // Original responses
  'projects': "I've worked on several projects, including this portfolio website which features a Vanta.js background, a fun mini-game, and this chatbot! I also built an e-commerce front-end prototype and a browser-based game. You can see more details in the 'Projects' section.",
  'skills': "My tech stack includes HTML, CSS, JavaScript, TypeScript, PHP, and Laravel. I'm also proficient with Tailwind CSS. I'm always eager to learn new technologies!",
  'stack': "My tech stack includes HTML, CSS, JavaScript, TypeScript, PHP, and Laravel. I'm also proficient with Tailwind CSS. I'm always eager to learn new technologies!",
  'contact': "You can contact Mark Jan via email at manlangitmarkjan@gmail.com or through the contact form on this website. He's also on LinkedIn and GitHub!",
  'experience': "Mark Jan is currently developing his capstone project and has completed intensive web development training. You can find more details in the 'Experience' section or on his downloadable resume.",
  'about': "Mark Jan is a 4th-year Information Systems student who enjoys building modern, responsive, and interactive websites. His goal is to continuously grow his skills and become a professional web developer.",
  'game': "There's a hidden mini-game on the site! Try clicking on the profile picture in the hero section a few times to find it. Let me know if you beat the high score!",

  // 🔹 Technical / recruiter-style questions
  'frontend': "Mark Jan specializes in front-end development using HTML, CSS, JavaScript, and Tailwind CSS. He has experience building responsive, modern interfaces.",
  'backend': "For back-end development, Mark Jan works with PHP and Laravel. He knows how to structure databases, manage APIs, and handle server-side logic.",
  'database': "Mark Jan has worked with MySQL and understands database design, queries, and integration with web applications.",
  'frameworks': "His main framework expertise is with Laravel for back-end and Tailwind CSS for front-end styling.",
  'version control': "Mark Jan uses Git and GitHub for version control and collaboration.",
  'deployment': "He has experience deploying websites to local servers and understands the basics of hosting and deployment workflows.",
  'sdlc': "He applies the Rapid Application Development (RAD) model in his projects, focusing on quick prototyping and iteration.",
  'tools': "His workflow includes Visual Studio Code, phpMyAdmin for database management, and GitHub for version control.",
  'languages': "He codes in HTML, CSS, JavaScript, TypeScript, and PHP.",
  'apis': "Mark Jan has experience integrating APIs, such as using OpenAI for chatbot features and working with RESTful APIs.",
  'problem solving': "Mark Jan is quick to debug issues and find creative solutions, especially in front-end interactivity and UI/UX challenges.",
  'strengths': "Mark Jan’s strengths are clean coding, responsiveness, problem-solving, and adding interactive elements to websites.",
  'weaknesses': "He’s still learning advanced frameworks like React and Node.js, but he’s eager to improve in those areas.",
  'goals': "Mark Jan’s goal is to become a professional web developer who builds impactful and innovative projects.",
  'capstone': "His capstone project is 'Barangay Event Management System with Integrated SMS and QR Code Technology' built with Laravel, designed to help communities manage events efficiently.",
  'ecommerce': "He has also built an e-commerce prototype for Sepak Takraw products, showcasing his design and front-end development skills.",
  'portfolio': "This portfolio itself is a project where he experimented with Vanta.js animations, hidden easter eggs, and a custom chatbot like me.",
  'hobbies': "Outside coding, Mark Jan enjoys playing games, exploring new tech, and working on fun personal projects.",
  'education': "He is currently a 4th-year Information Systems student at university.",
  'achievements': "Completing multiple advanced projects, creating interactive portfolio features, and continuously improving his coding skills are some of his achievements.",
  'future': "He aims to master modern JavaScript frameworks like React and Node.js, and gain experience working in professional development teams.",
  'pogi': "Of course! Everyone thinks Mark Jan is pogi 😉.",
  'gf': "Mark Jan's girlfriend is Jessica Olalo from Viga. He loves her very much ❤️."
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const lowerCaseMessage = message.toLowerCase();

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check for a predefined response before calling the API
    for (const keyword in predefinedResponses) {
      if (lowerCaseMessage.includes(keyword)) {
        // Add a 1.5-second delay to simulate typing for a more natural feel
        setTimeout(() => {
          res.json({ reply: predefinedResponses[keyword] });
        }, 1500);
        return; // Exit the function to prevent falling through to the OpenAI call
      }
    }

    // If no predefined response is found, proceed to OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Or your preferred model
      messages: [
        { role: 'system', content: "You are a chatbot that only talks about Mark Jan Manlangit. Answer all questions about his skills, projects, experience, and portfolio. Keep your answers concise and helpful." },
        { role: 'user', content: message }
      ],
    });

    // The frontend expects a 'reply' property in the response
    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    if (error instanceof OpenAI.APIError) {
      // Handle specific API errors for a better user experience
      if (error.status === 429) {
        res.status(429).json({ error: "I'm currently experiencing high demand. Please try again in a little while." });
      } else {
        res.status(error.status || 500).json({ error: "Sorry, I couldn’t fetch my info right now. Try asking again in a moment!" });
      }
    } else if (error.code === 'ENOTFOUND') {
      res.status(500).json({ error: 'Could not connect to OpenAI. Please check your network connection.' });
    } else {
      // Potentially an API key issue
      res.status(500).json({ error: 'An internal server error occurred. This could be due to an invalid API key or a problem with the OpenAI service.' });
    }
  }
});

// API route alias for production
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const lowerCaseMessage = message.toLowerCase();

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    for (const keyword in predefinedResponses) {
      if (lowerCaseMessage.includes(keyword)) {
        return res.json({ reply: predefinedResponses[keyword] });
      }
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: "You are a chatbot that only talks about Mark Jan Manlangit. Answer all questions about his skills, projects, experience, and portfolio. Keep your answers concise and helpful." },
        { role: 'user', content: message }
      ],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    if (error instanceof OpenAI.APIError) {
      if (error.status === 429) {
        res.status(429).json({ error: "I'm currently experiencing high demand. Please try again in a little while." });
      } else {
        res.status(error.status || 500).json({ error: "Sorry, I couldn't fetch my info right now. Try asking again in a moment!" });
      }
    } else if (error.code === 'ENOTFOUND') {
      res.status(500).json({ error: 'Could not connect to OpenAI. Please check your network connection.' });
    } else {
      res.status(500).json({ error: 'An internal server error occurred. This could be due to an invalid API key or a problem with the OpenAI service.' });
    }
  }
});

// --- Email Route ---
app.post('/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Get current date and time
    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Professional minimalist email template
    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Message from ${name}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #f9f9f9;">
        <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #eeeeee;">
              <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.3px;">New Message Received</h2>
              <p style="margin: 6px 0 0; font-size: 13px; color: #666666;">From your portfolio contact form</p>
            </td>
          </tr>
          
          <!-- Sender Info -->
          <tr>
            <td style="padding: 24px 32px; border-bottom: 1px solid #eeeeee;">
              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Sender</p>
              <p style="margin: 0; font-size: 15px; font-weight: 500; color: #1a1a1a;">${name}</p>
              <p style="margin: 4px 0 0; font-size: 13px; color: #666666;">${email}</p>
            </td>
          </tr>
          
          <!-- Message -->
          <tr>
            <td style="padding: 24px 32px; border-bottom: 1px solid #eeeeee;">
              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">Message</p>
              <blockquote style="margin: 0; padding: 16px 0 16px 16px; border-left: 2px solid #007bff; font-size: 14px; line-height: 1.6; color: #333333; font-style: normal;">
                ${message.split('\n').map(line => line || '<br>').join('\n')}
              </blockquote>
            </td>
          </tr>
          
          <!-- CTA Section -->
          <tr>
            <td style="padding: 28px 32px; text-align: center; border-bottom: 1px solid #eeeeee;">
              <a href="mailto:${email}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: 500; font-size: 14px; border-radius: 4px; border: 1px solid #007bff; transition: all 0.2s ease;">Reply to Message</a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 32px; background-color: #fafafa;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #999999; line-height: 1.5;">Received on ${timestamp}</p>
              <p style="margin: 0; font-size: 11px; color: #bbbbbb;">© 2025 Mark Jan Manlangit. This email was sent from your portfolio.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `New Message from ${name}`,
      html: emailTemplate,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

// API route alias for production
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const now = new Date();
    const timestamp = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const emailTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Message from ${name}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif; background-color: #f9f9f9;">
        <table style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-collapse: collapse;">
          <tr>
            <td style="padding: 32px 32px 24px; border-bottom: 1px solid #eeeeee;">
              <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: #1a1a1a; letter-spacing: -0.3px;">New Message Received</h2>
              <p style="margin: 6px 0 0; font-size: 13px; color: #666666;">From your portfolio contact form</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; border-bottom: 1px solid #eeeeee;">
              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">Sender</p>
              <p style="margin: 0; font-size: 15px; font-weight: 500; color: #1a1a1a;">${name}</p>
              <p style="margin: 4px 0 0; font-size: 13px; color: #666666;">${email}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px; border-bottom: 1px solid #eeeeee;">
              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #999999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">Message</p>
              <blockquote style="margin: 0; padding: 16px 0 16px 16px; border-left: 2px solid #007bff; font-size: 14px; line-height: 1.6; color: #333333; font-style: normal;">
                ${message.split('\n').map(line => line || '<br>').join('\n')}
              </blockquote>
            </td>
          </tr>
          <tr>
            <td style="padding: 28px 32px; text-align: center; border-bottom: 1px solid #eeeeee;">
              <a href="mailto:${email}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 12px 28px; text-decoration: none; font-weight: 500; font-size: 14px; border-radius: 4px; border: 1px solid #007bff; transition: all 0.2s ease;">Reply to Message</a>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; background-color: #fafafa;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #999999; line-height: 1.5;">Received on ${timestamp}</p>
              <p style="margin: 0; font-size: 11px; color: #bbbbbb;">© 2025 Mark Jan Manlangit. This email was sent from your portfolio.</p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `New Message from ${name}`,
      html: emailTemplate,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
});

// --- Server Start ---

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});