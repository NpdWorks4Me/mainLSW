import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
const ContestRulesModal = ({
  isOpen,
  onOpenChange
}) => {
  return <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="halloween-modal-content max-w-2xl w-[95vw]">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold halloween-gradient-text mb-2">Halloween Coloring Contest</DialogTitle>
          <DialogDescription className="text-white/80 text-lg">
            Official Rules & Requirements
          </DialogDescription>
        </DialogHeader>
        
        <div className="prose prose-invert prose-p:text-white/90 prose-h2:text-orange-400 prose-h3:text-purple-400 max-h-[60vh] overflow-y-auto p-4 rounded-lg bg-black/30 custom-scrollbar">
          <p>
            We are thrilled to invite you to participate in the LittleSpaceWorld Halloween Coloring Contest! This is your chance to showcase your creativity and style for a chance to win amazing prizes.
          </p>

          <h2>Official Contest Rules</h2>
          <h3>Who can enter?</h3>
          <p>
            This contest is open to everyone around the world! We highly encourage people from all cultures to participate and share their unique style. Please note, to be eligible for a physical prize, you must be a resident of the United States with a valid shipping address. International participants are not eligible for physical prizes.
          </p>
          
          <h3>What to submit?</h3>
          <p>
            Your artwork must be a completed Halloween-themed coloring page that captures the essence of the holiday. You are welcome to use any traditional coloring medium, including colored pencils, crayons, markers, or paints.
          </p>

          <h3>When to enter?</h3>
          <p>
            The contest entry period is officially open! All entries must be submitted by October 12th at 11:59 pm ET.
          </p>

          <h3>How to Enter?</h3>
          <p>
            To ensure your entry is verified as original, you must write "LSW" & the date of your submission directly on the coloring page itself before you photograph it. Once complete, simply email a clear, high-resolution photo of your coloring page to jeana@littlespaceworld.com with the subject: Contest.
          </p>

          <h2>Judging Criteria</h2>
          <p>
            Entries for the Grand Prize will be judged by a panel consisting of myself and two others. We will use a point-based system, rewarding both significant skill and visible effort across the following metrics:
          </p>
          <ul>
            <li><strong>Creativity & Originality:</strong> Your ability to use colors and ideas in a unique and imaginative way that makes your entry stand out.</li>
            <li><strong>Neatness & Workmanship:</strong> The cleanliness of your color application, attention to detail, and your ability to stay within the lines.</li>
            <li><strong>Relevance to Theme:</strong> How well your artwork aligns with the "spooky, cute" Halloween theme and captures the holiday’s spirit.</li>
            <li><strong>Color Harmony & Palette:</strong> Your choice of colors and how they work together to create a pleasing mood or overall visual effect.</li>
            <li><strong>Effort & Completion:</strong> Evidence of visible care and attention, ensuring the entire artwork is fully colored.</li>
            <li><strong>Overall Impact & Appeal:</strong> The overall effect of the artwork and its capacity to captivate and leave a lasting impression on the viewer.</li>
          </ul>

          <h2>Prizes & Categories</h2>
          <p>
            To celebrate all types of creative expression, we've created three first-place prizes:
          </p>
          <ul>
            <li>
              <strong>The Grand Prize Winner:</strong> Chosen for considerable skill and effort based on all six judging criteria.
              <br />
              <strong>Prize:</strong> A featured spotlight on littlespaceworld.com that runs this season and in the lead up to next year's contest, as well as a special edition mystery box from the shop (over a $75 total value). If the winner is ineligible for the physical prize, the spotlight credit will go to the initially chosen winner, and the physical prize will be awarded to the next eligible recipient.
            </li>
            <li>
              <strong>The "Spooktacular Spirit" Award Winner:</strong> This category is for the entry with the most imaginative and unique interpretation of the Halloween theme, regardless of technical skill.
              <br />
              <strong>Prize:</strong> A special-edition fidget keychain from the shop.
            </li>
            <li>
              <strong>The "Most Imaginative Palette" Award Winner:</strong> This category celebrates entrants who demonstrate a bold and creative use of color, even if it's unconventional.
              <br />
              <strong>Prize:</strong> A special-edition fidget keychain from the shop.
            </li>
          </ul>

        <h2>
            <br />
            The Legal Fine Print</h2>
          <ul>
            <li><strong>No Purchase Necessary:</strong> There is no purchase or payment required to enter or win a prize.</li>
            <li><strong>Use of Entry:</strong> By submitting your entry, you grant us permission to use, edit, and display your artwork for promotional purposes on our website.</li>
          </ul>
        </div>
        
        <DialogClose asChild>
          <Button variant="halloween-outline" className="mt-4 w-full">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>;
};
export default ContestRulesModal;