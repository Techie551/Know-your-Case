import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LegalDocumentService {
  // Store the OCR content of the handbooks as constants.
  // In a real-world scenario, these would be loaded from a database, file storage, or a dedicated API.
  // For the Applet environment, embedding them directly is a pragmatic approach.

  private BNS_CONTENT: string = `
    THE BHARATIYA NYAYA SANHITA, 2023
    CHAPTER I
    1. SHORT TITLE, COMMENCEMENT AND APPLICATION.
    (1) This Act may be called the Bharatiya Nyaya Sanhita, 2023.
    (3) Every person shall be liable to punishment under this Sanhita [Code]and not otherwise for every act or omission contrary to the provisions thereof, of which he shall be guilty within India.
    (4) Any person liable, by any law for the time being in force in India, to be tried for an offence committed beyond India shall be dealt with according to the provisions of this Sanhita [Code] for any act committed beyond India in the same manner as if such act had been committed within India.
    (5) The provisions of this Sanhita [Code] shall also apply to any offence committed by—
    (a) any citizen of India in any place without and beyond India;
    (b) any person on any ship or aircraft registered in India wherever it may be;
    (c) any person in any place without and beyond India committing offence targeting a computer resource located in India.
    Explanation.—In this section, the word “offence” includes every act committed outside India which, if committed in India, would be punishable under this Sanhita.
    Illustration A, who is a citizen of India, commits a murder in any place without and beyond India [Uganda]. He can be tried and convicted of murder in any place in India in which he may be found.

    CHAPTER II
    4. PUNISHMENTS.
    (a) Death; (b) Imprisonment for life; (c) Imprisonment, which is of two descriptions, namely: 1. Rigorous, that is, with hard labour; 2. Simple; (d) Forfeiture of property; (e) Fine; (f) Community Service.

    9. LIMIT OF PUNISHMENT OF OFFENCE MADE UP OF SEVERAL OFFENCES.
    (1) Where anything which is an offence is made up of parts, any of which parts is itself an offence, the offender shall not be punished with the punishment of more than one of such his offences, unless it be so expressly provided.

    CHAPTER V
    OF OFFENCES AGAINST WOMAN AND CHILD OF SEXUAL OFFENCES
    63. RAPE. A man is said to commit “rape” if he— (i) against her will; (vi) with or without her consent, when she is under eighteen years of age; (vii) when she is unable to communicate consent.
    64. PUNISHMENT FOR RAPE. (1) Whoever, except in the cases provided for in sub-section (2), commits rape, shall be punished with rigorous imprisonment for a term which shall not be less than ten years, but which may extend to imprisonment for life, which shall mean imprisonment for the remainder of that person’s natural life, and shall also be liable to fine.
    70. GANG RAPE. (1) Where a woman is raped by one or more persons constituting a group or acting in furtherance of a common intention, each of those persons shall be deemed to have committed the offence of rape and shall be punished with rigorous imprisonment for a term which shall not be less than twenty years, but which may extend to imprisonment for life which shall mean imprisonment for the remainder of that person’s natural life, and with fine.
    (2) Where a woman under eighteen years of age is raped by one or more persons constituting a group or acting in furtherance of a common intention, each of those persons shall be deemed to have committed the offence of rape and shall be punished with imprisonment for life, which shall mean imprisonment for the remainder of that person’s natural life, and with fine, or with death.

    CHAPTER VI
    OF OFFENCES AFFECTING THE HUMAN BODY
    101. MURDER. Except in the cases hereinafter excepted, culpable homicide is murder.
    106. CAUSING DEATH BY NEGLIGENCE. (1) Whoever causes death of any person by doing any rash or negligent act not amounting to culpable homicide, shall be punished with imprisonment of either description for a term which may extend to five years, and shall also be liable to fine; and if such act is done by a registered medical practitioner while performing medical procedure, he shall be punished with imprisonment of either description for a term which may extend to two years, and shall also be liable to fine.
    (2) Whoever causes death of any person by rash and negligent driving of vehicle not amounting to culpable homicide, and escapes without reporting it to a police officer or a Magistrate soon after the incident, shall be punished with imprisonment of a term which may extend to ten years, and shall also be liable to fine.

    CHAPTER XI
    OF OFFENCES AGAINST THE PUBLIC TRANQUILLITY
    189. UNLAWFUL ASSEMBLY. (1) An assembly of five or more persons is designated an “unlawful assembly”, if the common object of the persons composing that assembly is— (a) [First] to overawe by criminal force, or show of criminal force, the Central Government or any State Government or Parliament or the Legislature of any State, or any public servant in the exercise of the lawful power of such public servant; or (b) [Second] to resist the execution of any law, or of any legal process; or (c) [Third] to commit any mischief or criminal trespass, or other offence; or (d) [Fourth] by means of criminal force, or show of criminal force, to any person, to take or obtain possession of any property, or to deprive any person of the enjoyment of a right of way, or of the use of water or other incorporeal right of which he is in possession or enjoyment, or to enforce any right or supposed right; or (e) [Sixth] by means of criminal force, or show of criminal force, to compel any person to do what he is not legally bound to do, or to omit to do what he is legally entitled to do.
    191. RIOTING (1) Whenever force or violence is used by an unlawful assembly, or by any member thereof, in prosecution of the common object of such assembly, every member of such assembly is guilty of the offence of rioting. (2) [Punishment for rioting] Whoever is guilty of rioting, shall be punished with imprisonment of either description for a term which may extend to two years, or with fine, or with both.

    CHAPTER XVII
    OF OFFENCES AGAINST PROPERTY OF THEFT
    303. THEFT (1) Whoever, intending to take dishonestly any movable property out of the possession of any person without that person’s consent, moves that property in order to such taking, is said to commit theft. (2) [Punishment for theft] Whoever commits theft shall be punished with imprisonment of either description for a term which may extend to three years, or with fine, or with both and in case of second or subsequent conviction of any person under this section, he shall be punished with rigorous imprisonment for a term which shall not be less than one year but which may extend to five years and with fine.
    304. SNATCHING. (1) Theft is snatching if, in order to commit theft, the offender suddenly or quickly or forcibly seizes or secures or grabs or takes away from any person or from his possession any movable property. (2) Whoever commits snatching, shall be punished with imprisonment of either description for a term which may extend to three years, and shall also be liable to fine.
  `;

  private BNSS_CONTENT: string = `
    THE BHARATIYA NAGARIK SURAKSHA SANHITA, 2023
    CHAPTER I - PRELIMINARY
    2. DEFINITIONS.
    (1) (a) “audio-video electronic means” shall include use of any communication device for the purposes of video conferencing, recording of processes of identification, search and seizure or evidence, transmission of electronic communication and for such other purposes and by such other means as the State Government may, by rules provide;
    (y) “victim” means a person who has suffered any loss or injury caused by reason of the act or omission of the accused person and includes the guardian or legal heir of such victim;

    CHAPTER V
    ARREST OF PERSONS
    35. WHEN POLICE MAY ARREST WITHOUT WARRANT.
    (1) Any police officer may without an order from a Magistrate and without a warrant, arrest any person— (a) who commits, in the presence of a police officer, a cognizable offence; or (b) against whom a reasonable complaint has been made, or credible information has been received, or a reasonable suspicion exists that he has committed a cognizable offence punishable with imprisonment for a term which may be less than seven years or which may extend to seven years whether with or without fine, if the following conditions are satisfied, namely:— (i) the police officer has reason to believe on the basis of such complaint, information, or suspicion that such person has committed the said offence; (ii) the police officer is satisfied that such arrest is necessary— (a) to prevent such person from committing any further offence; or (b) for proper investigation of the offence; or (c) to prevent such person from causing the evidence of the offence to disappear or tampering with such evidence in any manner; or (d) to prevent such person from making any inducement, threat or promise to any person acquainted with the facts of the case so as to dissuade him from disclosing such facts to the Court or to the police officer; or (e) as unless such person is arrested, his presence in the Court whenever required cannot be ensured, and the police officer shall record while making such arrest, his reasons in writing: Provided that a police officer shall, in all cases where the arrest of a person is not required under the provisions of this sub-section, record the reasons in writing for not making the arrest; or (c) against whom credible information has been received that he has committed a cognizable offence punishable with imprisonment for a term which may extend to more than seven years whether with or without fine or with death sentence and the police officer has reason to believe on the basis of that information that such person has committed the said offence; or (d) who has been proclaimed as an offender either under this Sanhita [Code] or by order of the State Government; or (e) in whose possession anything is found which may reasonably be suspected to be stolen property and who may reasonably be suspected of having committed an offence with reference to such thing; or (f) who obstructs a police officer while in the execution of his duty, or who has escaped, or attempts to escape, from lawful custody; or (g) who is reasonably suspected of being a deserter from any of the Armed Forces of the Union; or (h) who has been concerned in, or against whom a reasonable complaint has been made, or credible information has been received, or a reasonable suspicion exists, of his having been concerned in, any act committed at any place out of India which, if committed in India, would have been punishable as an offence, and for which he is, under any law relating to extradition, or otherwise, liable to be apprehended or detained in custody in India; or (i) who, being a released convict, commits a breach of any rule made under sub-section (5) of section 394; [356] or (j) for whose arrest any requisition, whether written or oral, has been received from another police officer, provided that the requisition specifies the person to be arrested and the offence or other cause for which the arrest is to be made and it appears therefrom that the person might lawfully be arrested without a warrant by the officer who issued the requisition.
    36. PROCEDURE OF ARREST AND DUTIES OF OFFICER MAKING ARREST. Every police officer while making an arrest shall— (a) bear an accurate, visible and clear identification of his name which will facilitate easy identification; (b) prepare a memorandum of arrest which shall be— (i) attested by at least one witness, who is a member of the family of the person arrested or a respectable member of the locality where the arrest is made; (ii) countersigned by the person arrested; and (c) inform the person arrested, unless the memorandum is attested by a member of hisfamily, that he has a right to have a relative or a friend or any other person named by him to be informed of his arrest.
    43. ARREST HOW MADE. (3) The police officer may, keeping in view the nature and gravity of the offence, use handcuff while making the arrest of a person or while producing such person before the court who is a habitual or repeat offender, or who escaped from custody, or who has committed offence of organised crime, terrorist act, drug related crime, or illegal possession of arms and ammunition, murder, rape, acid attack, counterfeiting of coins and currency notes, human trafficking, sexual offence against children, or offence against the State. (5) Save in exceptional circumstances, no woman shall be arrested after sunset and before sunrise, and where such exceptional circumstances exist, the woman police officer shall, by making a written report, obtain the prior permission of the Magistrate of the first class within whose local jurisdiction the offence is committed or the arrest is to be made.
    58. PERSON ARRESTED NOT TO BE DETAINED MORE THAN TWENTY-FOUR HOURS. No police officer shall detain in custody a person arrested without warrant for a longer period than under all the circumstances of the case is reasonable, and such period shall not, in the absence of a special order of a Magistrate under section 187, [167] exceed twenty-four hours exclusive of the time necessary for the journey from the place of arrest to the Magistrate’s Court, whether having jurisdiction or not.

    CHAPTER XIII
    INFORMATION TO THE POLICE AND THEIR POWERS TO INVESTIGATE
    173. INFORMATION IN COGNIZABLE CASES. (1) Every information relating to the commission of a cognizable offence, irrespective of the area where the offence is committed, may be [if] given orally or by electronic communication to an officer in charge of a police station, and if given— (i) orally, it shall be reduced to writing by him or under his direction, and be read over to the informant; and every such information, whether given in writing or reduced towriting as aforesaid, shall be signed by the person giving it; (ii) by electronic communication, it shall be taken on record by him on being signed within three days by the person giving it, and the substance thereof shall be entered in a book to be kept by such officer in such form as the State Government may by rules prescribe in this behalf: Provided that if the information is given by the woman against whom an offence under section 64, section 65, section 66, section 67, section 68, section 69, section 70,section 71, section 74, section 75, section 76, section 77, section 78, section 79 or section 124 of the Bharatiya Nyaya Sanhita, 2023 [326A, 326B, 354, 354A, 354B, 354C, 354D, 376,376A, 376AB, 376B, 376C, 376D, 376DA, 376DB, 376E, 509 IPC] is alleged to have been committed or attempted, then such information shall be recorded, by a woman police officer or any woman officer.
    183. RECORDING OF CONFESSIONS AND STATEMENTS (1) Any Magistrate of the District in which the information about commission of any offence has been registered, [Any Metropolitan Magistrate or Judicial Magistrate]may, whether or not he has jurisdiction in the case, record any confession or statement made to him in the course of an investigation under this Chapter or under any other law for the time being in force, or at any time afterwards but before the commencement of the inquiry or trial: Provided that any confession or statement made under this sub-section may also be recorded by audio-video electronic means in the presence of the advocate of the person accused of an offence:
    184. MEDICAL EXAMINATION OF VICTIM OF RAPE (1) Where, during the stage when an offence of committing rape or attempt to commit rape is under investigation, it is proposed to get the person of the woman with whom rape is alleged or attempted to have been committed or attempted, examined by a medical expert, such examination shall be conducted by a registered medical practitioner employed in a hospital run by the Government or a local authority and in the absence of such a practitioner, by any other registered medical practitioner, with the consent of such woman or of a person competent to give such consent on her behalf and such woman shall be sent to such registered medical practitioner within twenty-four hours from the time of receiving the information relating to the commission of such offence. (6) The registered medical practitioner shall, within a period of seven days [without delay] forward the report to the investigating officer who shall forward it to the Magistrate referred to in section 193 [173] as part of the documents referred to in clause (a) of sub-section (6) [sub-section (5)] of that section.
    185. SEARCH BY POLICE OFFICER (2) A police officer proceeding under sub-section (1), shall, if practicable, conduct the search in person: Provided that the search conducted under this section shall be recorded through audio-video electronic means preferably by mobile phone.
  `;

  private BSA_CONTENT: string = `
    THE BHARATIYA SAKSHYA ADHINIYAM, 2023
    PART I, CHAPTER I - PRELIMINARY
    1. Short title, application and commencement.
    (2) It applies to all judicial proceedings in or before any Court, including Courts-martial, but not to affidavits presented to any Court or officer, nor to proceedings before an arbitrator.
    2. Definitions.
    (1) (e) "evidence" means and includes— (i) all statements including statements given electronically which the Court permits or requires to be made before it by witnesses in relation to matters of fact under inquiry and such statements are called oral evidence; (ii) all documents including electronic or digital records produced for the inspection of the Court and such documents are called documentary evidence;

    PART IV, CHAPTER VII - OF THE BURDEN OF PROOF
    104. Whoever desires any Court to give judgment as to any legal right or liability dependent on the existence of facts which he asserts must prove that those facts exist, and when a person is bound to prove the existence of any fact, it is said that the burden of proof lies on that person.
    108. When a person is accused of any offence, the burden of proving the existence of circumstances bringing the case within any of the General Exceptions in the Bharatiya Nyaya Sanhita, 2023 or within any special exception or proviso contained in any other part of the said Sanhita, or in any law defining the offence, is upon him, and the Court shall presume the absence of such circumstances.
    119. (1) The Court may presume the existence of any fact which it thinks likely to have happened, regard being had to the common course of natural events, human conduct and public and private business, in their relation to the facts of the particular case. (a) a man who is in possession of stolen goods soon, after the theft is either the thief or has received the goods knowing them to be stolen, unless he can account for his possession; (b) an accomplice is unworthy of credit, unless he is corroborated in material particulars;
    120. In a prosecution for rape under sub-section (2) of section 64 of the Bharatiya Nyaya Sanhita, 2023, where sexual intercourse by the accused is proved and the question is whether it was without the consent of the woman alleged to have been raped and such woman states in her evidence before the Court that she did not consent, the Court shall presume that she did not consent.
  `;

  private documentMap: Map<string, string> = new Map<string, string>();

  constructor() {
    this.initializeDocumentMap();
  }

  private initializeDocumentMap(): void {
    const documents = [
      { name: 'BNS', content: this.BNS_CONTENT },
      { name: 'BNSS', content: this.BNSS_CONTENT },
      { name: 'BSA', content: this.BSA_CONTENT }
    ];

    documents.forEach(doc => {
      const lines = doc.content.split('\\n');
      lines.forEach(line => {
        const sectionMatch = line.match(/(BNS|BNSS|BSA) Section (\d+)/i);
        if (sectionMatch) {
          const fullSectionName = `${sectionMatch[1]} Section ${sectionMatch[2]}`;
          this.documentMap.set(fullSectionName, line);
        } else {
            // Also add chapter level info
            const chapterMatch = line.match(/(BNS|BNSS|BSA) Chapter ([\w\s-]+)/i);
            if (chapterMatch) {
                const fullChapterName = `${chapterMatch[1]} Chapter ${chapterMatch[2].trim()}`;
                if (!this.documentMap.has(fullChapterName)) { // Avoid overwriting if a more specific section is added later
                    this.documentMap.set(fullChapterName, line);
                }
            }
        }
      });
    });
  }

  // A simple keyword-based search to retrieve relevant snippets from the stored documents.
  searchDocuments(query: string): string[] {
    const keywords = query.toLowerCase().split(/\s+/);
    const relevantSnippets: Set<string> = new Set<string>();

    this.documentMap.forEach((contentLine, sectionIdentifier) => {
      const lowerCaseContent = contentLine.toLowerCase();
      // Simple match: if any keyword is in the content line or section identifier
      if (keywords.some(keyword => lowerCaseContent.includes(keyword) || sectionIdentifier.toLowerCase().includes(keyword))) {
        // Add the full content line for context, or a more curated snippet if needed
        relevantSnippets.add(`${sectionIdentifier}: ${contentLine.trim()}`);
      }
    });

    // Limit the number of snippets to avoid exceeding token limits
    return Array.from(relevantSnippets).slice(0, 5); // Return top 5 relevant snippets
  }
}
