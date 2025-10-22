'use client'

import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      question: "What is Ideator?",
      answer: "Ideator is an AI-powered web application that helps you discover and save creative project ideas. Whether you're looking for your next app idea, business venture, or creative project, Ideator generates personalized suggestions based on your interests and preferences."
    },
    {
      question: "How do I search for ideas?",
      answer: "There are two ways to search:\n\n1. **Free-text Search**: Simply type what you're interested in (e.g., 'fitness app ideas' or 'sustainable business ideas') on the main search page.\n\n2. **Category Search**: Use the category search to browse ideas by specific categories, technologies, complexity levels, and time investment. This helps you find ideas that match your skills and available time."
    },
    {
      question: "How does the swipeable card interface work?",
      answer: "After searching, you'll see ideas one at a time in a card format. You have three options:\n\n• **Swipe/Tap Left (Skip)**: Pass on this idea and move to the next one\n• **Tap Center (Review Later)**: Mark the idea to review later in this session (not saved to your account)\n• **Swipe/Tap Right (Save)**: Save this idea to your collection\n\nYou can swipe the cards with your finger/mouse or use the buttons below the card."
    },
    {
      question: "What happens to 'Review Later' ideas?",
      answer: "'Review Later' ideas are temporarily stored for the current session only. They appear in a yellow-highlighted section after you finish swiping, allowing you to review them before deciding whether to save them permanently. These ideas are NOT saved to your account and will disappear when you close your browser or start a new search."
    },
    {
      question: "How can I organize my saved ideas?",
      answer: "You can organize your saved ideas using:\n\n• **Folders**: Create custom folders (e.g., 'Mobile Apps', 'Side Projects') and assign ideas to them\n• **Tags**: Add multiple tags to each idea for flexible categorization (e.g., 'urgent', 'high-priority', 'learning')\n• **Search**: Use the search bar on the Saved Ideas page to quickly find specific ideas\n• **Filters**: Filter your ideas by folder or tags to focus on what matters"
    },
    {
      question: "Can I export my saved ideas?",
      answer: "Yes! You can export your ideas as PDF files:\n\n• **Single Export**: Click the download icon on any individual idea card to export just that idea\n• **Bulk Export**: Use the 'Export PDF' button at the top of the Saved Ideas page to export all your saved ideas (or filtered ideas) at once\n\nThe PDF includes all details: title, description, technology, complexity, time to build, and monetization strategies."
    },
    {
      question: "How do I view detailed information about an idea?",
      answer: "Click on any idea card to open a detailed view. This shows:\n\n• Full description\n• Technology stack\n• Complexity level\n• Estimated time to build\n• Monetization strategies\n• Whether the idea is already saved to your collection\n\nYou can also save or unsave ideas from the detail view."
    },
    {
      question: "Can I undo a swipe decision?",
      answer: "Yes! While swiping through ideas, you'll see an 'Undo' button that lets you go back to the previous card and reverse your decision. This is helpful if you accidentally skip an interesting idea."
    },
    {
      question: "Where can I see my search history?",
      answer: "Click on 'History' in the menu to view all your past searches. Each history entry shows:\n\n• Your search query\n• When you searched\n• Number of ideas generated\n• A 'Search Again' button to quickly repeat the same search"
    },
    {
      question: "How does the AI generate ideas?",
      answer: "Ideator uses Google's Gemini AI to generate creative, relevant project ideas based on your search criteria. The AI considers:\n\n• Your search query or selected categories\n• Technology preferences\n• Complexity level\n• Time commitment\n• Current trends and real-world applications\n\nEach idea includes practical details to help you evaluate its feasibility."
    },
    {
      question: "Do I need an account to use Ideator?",
      answer: "Yes, you need to create a free account to save ideas and access your personalized collection. Creating an account allows you to:\n\n• Save unlimited ideas\n• Organize ideas with folders and tags\n• Access your ideas from any device\n• View your search history\n• Export ideas as PDFs"
    },
    {
      question: "Is my data secure?",
      answer: "Yes! Ideator uses Supabase for authentication and data storage, which provides:\n\n• Secure authentication\n• Row-level security (you can only access your own data)\n• Encrypted data transmission\n• Industry-standard security practices\n\nYour ideas and searches are private and only visible to you."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-4xl font-bold text-black mb-3">About Ideator</h1>
          <p className="text-lg text-gray-600">
            Your AI-powered companion for discovering and organizing creative project ideas
          </p>
        </div>

        {/* FAQ Section */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-black mb-4">Frequently Asked Questions</h2>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-uber-lg overflow-hidden bg-white hover:shadow-uber transition-shadow duration-200"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-black pr-4">
                  {faq.question}
                </h3>
                {openFaq === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-6 pb-4 pt-2">
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            Have more questions? Feel free to explore the app and discover all its features!
          </p>
        </div>
      </div>
    </div>
  );
}
