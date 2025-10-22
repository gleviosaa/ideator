'use client'

import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IdeatorLogo } from '@/components/IdeatorLogo';
import { useRouter } from 'next/navigation';

interface BulletItem {
  title: string;
  description?: string;
}

interface NumberedItem {
  title: string;
  description: string;
}

interface FaqAnswer {
  text: string;
  bullets?: BulletItem[];
  numbered?: NumberedItem[];
  footer?: string;
}

interface Faq {
  question: string;
  answer: FaqAnswer;
}

export default function AboutPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs: Faq[] = [
    {
      question: "What is Ideator?",
      answer: {
        text: "Ideator is an AI-powered web application that helps you discover and save creative project ideas. Whether you're looking for your next app idea, business venture, or creative project, Ideator generates personalized suggestions based on your interests and preferences."
      }
    },
    {
      question: "How do I search for ideas?",
      answer: {
        text: "There are two ways to search:",
        numbered: [
          { title: "Free-text Search", description: "Simply type what you're interested in (e.g., 'fitness app ideas' or 'sustainable business ideas') on the main search page." },
          { title: "Category Search", description: "Use the category search to browse ideas by specific categories, technologies, complexity levels, and time investment. This helps you find ideas that match your skills and available time." }
        ]
      }
    },
    {
      question: "How does the swipeable card interface work?",
      answer: {
        text: "After searching, you'll see ideas one at a time in a card format. You have three options:",
        bullets: [
          { title: "Swipe/Tap Left (Skip)", description: "Pass on this idea and move to the next one" },
          { title: "Tap Center (Review Later)", description: "Mark the idea to review later in this session (not saved to your account)" },
          { title: "Swipe/Tap Right (Save)", description: "Save this idea to your collection" }
        ],
        footer: "You can swipe the cards with your finger/mouse or use the buttons below the card."
      }
    },
    {
      question: "What happens to 'Review Later' ideas?",
      answer: {
        text: "'Review Later' ideas are temporarily stored for the current session only. They appear in a yellow-highlighted section after you finish swiping, allowing you to review them before deciding whether to save them permanently. These ideas are NOT saved to your account and will disappear when you close your browser or start a new search."
      }
    },
    {
      question: "How can I organize my saved ideas?",
      answer: {
        text: "You can organize your saved ideas using:",
        bullets: [
          { title: "Folders", description: "Create custom folders (e.g., 'Mobile Apps', 'Side Projects') and assign ideas to them" },
          { title: "Tags", description: "Add multiple tags to each idea for flexible categorization (e.g., 'urgent', 'high-priority', 'learning')" },
          { title: "Search", description: "Use the search bar on the Saved Ideas page to quickly find specific ideas" },
          { title: "Filters", description: "Filter your ideas by folder or tags to focus on what matters" }
        ]
      }
    },
    {
      question: "Can I export my saved ideas?",
      answer: {
        text: "Yes! You can export your ideas as PDF files:",
        bullets: [
          { title: "Single Export", description: "Click the download icon on any individual idea card to export just that idea" },
          { title: "Bulk Export", description: "Use the 'Export PDF' button at the top of the Saved Ideas page to export all your saved ideas (or filtered ideas) at once" }
        ],
        footer: "The PDF includes all details: title, description, technology, complexity, time to build, and monetization strategies."
      }
    },
    {
      question: "How do I view detailed information about an idea?",
      answer: {
        text: "Click on any idea card to open a detailed view. This shows:",
        bullets: [
          { title: "Full description" },
          { title: "Technology stack" },
          { title: "Complexity level" },
          { title: "Estimated time to build" },
          { title: "Monetization strategies" },
          { title: "Whether the idea is already saved to your collection" }
        ],
        footer: "You can also save or unsave ideas from the detail view."
      }
    },
    {
      question: "Can I undo a swipe decision?",
      answer: {
        text: "Yes! While swiping through ideas, you'll see an 'Undo' button that lets you go back to the previous card and reverse your decision. This is helpful if you accidentally skip an interesting idea."
      }
    },
    {
      question: "Where can I see my search history?",
      answer: {
        text: "Click on 'History' in the menu to view all your past searches. Each history entry shows:",
        bullets: [
          { title: "Your search query" },
          { title: "When you searched" },
          { title: "Number of ideas generated" },
          { title: "A 'Search Again' button to quickly repeat the same search" }
        ]
      }
    },
    {
      question: "How does the AI generate ideas?",
      answer: {
        text: "Ideator uses Google's Gemini AI to generate creative, relevant project ideas based on your search criteria. The AI considers:",
        bullets: [
          { title: "Your search query or selected categories" },
          { title: "Technology preferences" },
          { title: "Complexity level" },
          { title: "Time commitment" },
          { title: "Current trends and real-world applications" }
        ],
        footer: "Each idea includes practical details to help you evaluate its feasibility."
      }
    },
    {
      question: "Do I need an account to use Ideator?",
      answer: {
        text: "Yes, you need to create a free account to save ideas and access your personalized collection. Creating an account allows you to:",
        bullets: [
          { title: "Save unlimited ideas" },
          { title: "Organize ideas with folders and tags" },
          { title: "Access your ideas from any device" },
          { title: "View your search history" },
          { title: "Export ideas as PDFs" }
        ]
      }
    },
    {
      question: "Is my data secure?",
      answer: {
        text: "Yes! Ideator uses Supabase for authentication and data storage, which provides:",
        bullets: [
          { title: "Secure authentication" },
          { title: "Row-level security (you can only access your own data)" },
          { title: "Encrypted data transmission" },
          { title: "Industry-standard security practices" }
        ],
        footer: "Your ideas and searches are private and only visible to you."
      }
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
          <div className="flex justify-center mb-6">
            <IdeatorLogo size="lg" />
          </div>
          <h1 className="text-4xl font-bold text-black mb-3 text-center">About Ideator</h1>
          <p className="text-lg text-gray-600 text-center">
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
                  <div className="text-gray-700 leading-relaxed space-y-3">
                    <p>{faq.answer.text}</p>

                    {faq.answer.numbered && (
                      <ol className="list-decimal list-inside space-y-2 ml-2">
                        {faq.answer.numbered.map((item, i) => (
                          <li key={i} className="pl-2">
                            <span className="font-semibold text-black">{item.title}:</span>{' '}
                            {item.description}
                          </li>
                        ))}
                      </ol>
                    )}

                    {faq.answer.bullets && (
                      <ul className="space-y-2 ml-2">
                        {faq.answer.bullets.map((item, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-black mt-1.5">•</span>
                            <span>
                              <span className="font-semibold text-black">{item.title}</span>
                              {item.description && <span>: {item.description}</span>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {faq.answer.footer && (
                      <p className="pt-1">{faq.answer.footer}</p>
                    )}
                  </div>
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
