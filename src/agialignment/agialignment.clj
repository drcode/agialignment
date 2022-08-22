(ns agialignment.agialignment
  (:require [fbc-utils.debug]
            [fbc-utils.core :as ut]
            [datahike.api :as dh]
            [super-server.super-server :as ss]            
            [agialignment.resolvers :as re]
            [agialignment.twitter :as tw]
            [agialignment.scraper :as sc]))

(def db-schema {:user/userid       :string
                :user/x            :bigint
                :user/y            :bigint
                :user/followers    :long
                :user/aiResearcher :boolean
                :user/aiRisk       :boolean
                :user/expert       :boolean
                :user/message      :string})

(def graphql-schema {:interfaces {:Node {:fields {:id {:type '(non-null ID)}}}}
                     :objects    {:App    {:implements [:Node]
                                           :fields     {:id      {:type '(non-null ID)}
                                                        :userid  {:type 'String}
                                                        :avatars {:type    '(list :Avatar)
                                                                  :resolve #'re/app-avatars}}}
                                  :Avatar {:implements [:Node]
                                           :fields     {:id           {:type '(non-null ID)}
                                                        :userid       {:type 'String}
                                                        :x            {:type 'Int}
                                                        :y            {:type 'Int}
                                                        :followers    {:type 'Float}
                                                        :aiResearcher {:type 'Boolean}
                                                        :aiRisk       {:type 'Boolean}
                                                        :expert       {:type 'Boolean}
                                                        :message      {:type 'String}}}}
                     :queries    {:app {:type    :App
                                        :args    {:useridOverride {:type 'String}
                                                  :oauthToken     {:type 'String}
                                                  :oauthVerifier  {:type 'String}}
                                        :resolve #'re/app}
                                  :url {:type 'String
                                        :resolve #'re/url}}
                     :mutations  {:updateAvatar         {:type    :Avatar
                                                         :args    {:useridOverride {:type 'String}
                                                                   :aiResearcher   {:type 'Boolean}
                                                                   :aiRisk         {:type 'Boolean}
                                                                   :message        {:type 'String}}
                                                         :resolve #'re/update-avatar}
                                  :addAvatar            {:type    :App
                                                         :args    {:useridOverride {:type 'String}}
                                                         :resolve #'re/add-avatar}
                                  :deleteAvatar         {:type    :App
                                                         :args    {:useridOverride {:type 'String}}
                                                         :resolve #'re/delete-avatar}
                                  :updateAvatarPosition {:type    :Avatar
                                                         :args    {:useridOverride {:type 'String}
                                                                   :x              {:type 'Int}
                                                                   :y              {:type 'Int}}
                                                         :resolve #'re/update-avatar-position}}})

(defn empty-temp-database! []
  (ss/empty-temp-database! db-schema))

(defn add-dummy-data! []
  (dotimes [n 100]
    (dh/transact @ss/db [[:db/add -1 :user/userid (str "derp" n)]
                         [:db/add -1 :user/x (- (rand-int 2000) 1000)]
                         [:db/add -1 :user/y (- (rand-int 2000) 1000)]
                         [:db/add -1 :user/followers (apply * (repeat 6 (rand-int 10)))]
                         [:db/add -1 :user/aiResearcher (zero? (rand-int 2))]
                         [:db/add -1 :user/aiRisk (zero? (rand-int 2))]])))

(defn permanent-database! []
  (ss/permanent-database! db-schema "database"))

(defn start-server []
  (ss/start-server {:schema         graphql-schema
                    :local-react?   false
                    :port           8892
                    :user-accounts? false})
  :started)

(defn start-server-local-react []
  (ss/start-server {:schema         graphql-schema
                    :local-react?   true
                    :port           8892
                    :user-accounts? false})
  :started)

;;(empty-temp-database!)
;;(add-dummy-data!)
;;(fill-starting-data)
;;(permanent-database!)
;;(start-server-local-react)

;;(start-server)

(defn limited-precision [n]
  (float (/ (ut/round (* 10 n)) 10)))

(defn time-formula [n] ;given alkn n from 0->100 generates a plausible year
  (+ (* 2.1500000000000000e+003)
     (* -4.6866666666668495e+000 n)
     (* 8.0133333333343076e-002 n n)
     (* -6.9333333333348990e-004 n n n)
     (* 2.3466666666674403e-006 n n n n)))

(defn risk-formula [n] ;given an n from 0->100 generates a plausible risk
  (+ (* 8.4285714285718205e-001)
     (* 3.3857142857141720e-001 n)
     (* 4.9142857142860322e-003 n n)
     (* 1.5999999999997882e-005 n n n)))

(defn round-all-possible [coll] ;if numbers can be rounded without conflicting with neighbors, do it
  (map (fn [a b c]
         (if (or (= (float b) (float (ut/round b)))
                 (and (not= (ut/round a) b)
                      (not= (ut/round a) (ut/round b))
                      (not= a (ut/round b))
                      (not= (ut/round c) b)
                      (not= (ut/round c) (ut/round b))
                      (not= c (ut/round b))))
           (ut/round b)
           b))
       (cons -100000 coll)
       coll
       (next (cycle coll))))

(def time-range (vec (round-all-possible (map limited-precision
                                              (reduce (fn [acc item]
                                                        (cons (if-let [[prev] (seq acc)]
                                                                (max item (+ prev 0.1))
                                                                item)
                                                              acc))
                                                      ()
                                                      (reverse (map time-formula (range 101))))))))

(def risk-range (vec (round-all-possible (reverse (map limited-precision
                                                       (reduce (fn [acc item]
                                                                 (cons (if-let [[prev] (seq acc)]
                                                                         (max item (+ prev 0.1))
                                                                         item)
                                                                       acc))
                                                               ()
                                                               (map risk-formula (range 101))))))))

(defn closest-range-match [val rang]
  (apply min-key
         (fn [n]
           (ut/abs (- val (rang n))))
         (range 101)))

(def starting-data [{:userid       "RichardSSutton"
                     :message      "Canadian computer scientist. Research scientist at DeepMind and a professor of computing science at the University of Alberta."
                     :aiResearcher true
                     :whenAgi      2040
                     :agiDoom      1}
                    {:userid       "raykurzweil"
                     :message      "American inventor and futurist. He is involved in fields such as optical character recognition (OCR), text-to-speech synthesis, speech recognition technology, and electronic keyboard instruments."
                     :aiResearcher true
                     :whenAgi 	    2029
                     :agiDoom      2}
                    {:userid  "robinhanson"
                     :message "Associate professor of economics at George Mason University and a research associate at the Future of Humanity Institute of Oxford University. He is known for his work on idea futures and markets."
                     :whenAgi 2120
                     :agiDoom 2.5}
                    {:userid       "rodneyabrooks"
                     :message      "Australian roboticist, Fellow of the Australian Academy of Science, author, and robotics entrepreneur, most known for popularizing the actionist approach to robotics."
                     :aiResearcher true
                     :whenAgi      2400
                     :agiDoom      2.5}
                    {:userid       "AndrewYNg"
                     :message      "Co-Founder of Coursera; Stanford CS adjunct faculty. Former head of Baidu AI Group/Google Brain."
                     :aiResearcher true
                     :whenAgi      2070
                     :agiDoom      3}
                    {:userid       "ylecun"
                     :message      "Professor at NYU. Chief AI Scientist at Meta. Researcher in AI, Machine Learning, Robotics, etc. ACM Turing Award Laureate."
                     :aiResearcher true
                     :whenAgi      2065
                     :agiDoom      3}
                    {:userid  "rohinmshah"
                     :message "Research Scientist at DeepMind. Publishes the Alignment Newsletter."
                     :aiRisk  true
                     :whenAgi 2060
                     :agiDoom 5}
                    {:userid  "jessi_cata"
                     :message "AI & cogsci-influenced philosopher, designer of scalable blockchain algorithms, embodied game theorist"
                     :whenAgi 2400
                     :agiDoom 4}
                    {:userid       "GaryMarcus"
                     :message      "Author Rebooting.AI & Guitar Zero; Founder, Geometric Intelligence & RobustAI. NYU Prof Emeritus"
                     :aiResearcher true
                     :whenAgi      2090
                     :agiDoom      4}
                    {:userid  "tobyordoxford"
                     :message "Senior Research Fellow — Future of Humanity Institute at Oxford. Author — The Precipice: Existential Risk and the Future of Humanity"
                     :whenAgi 2065
                     :agiDoom 10}
                    {:userid       "stuhlmueller"
                     :message      "Cofounder of Ought, a non-profit doing research on using machine learning to support deliberation. Previously, researcher in Noah Goodman's Computation & Cognition lab at Stanford."
                     :aiResearcher true
                     :whenAgi      2048
                     :agiDoom      16}
                    {:userid  "paulfchristiano"
                     :message "Researcher at OpenAI and research associate at the Future of Humanity Institute, working on AI alignment. Completed a PhD in the theory of computing group at UC Berkeley."
                     :aiRisk  true
                     :whenAgi 2048
                     :agiDoom 18}
                    {:userid  "peterthiel"
                     :message "Technology entrepreneur & investor"
                     :whenAgi 2100
                     :agiDoom 4}
                    {:userid       "MatthewJBar"
                     :message      "Shares things. Predictions: @MJBPredictions. Married to @natalia__coelho."
                     :aiResearcher true
                     :whenAgi      2060
                     :agiDoom      25}
                    {:userid  "danieldennett"
                     :message "Author and philosopher of mind and cognitive scientist at Tufts University"
                     :whenAgi 2075
                     :agiDoom 5}
                    {:userid       "RichardMCNgo"
                     :message      "Researcher at OpenAI"
                     :aiResearcher true
                     :whenAgi      2050
                     :agiDoom      40}
                    {:userid  "HiFromMichaelV"
                     :message "American futurist, activist, and entrepreneur. Focused on the prevention of global catastrophic risk from emerging technology."
                     :whenAgi 2053
                     :agiDoom 7}
                    {:userid  "VitalikButerin"
                     :message "Principal designer of the Ethereum cryptocurrency, computer scientist."
                     :whenAgi 2050
                     :agiDoom 60}
                    {:userid       "slatestarcodex"
                     :message      "Psychiatrist, blogger on rationality, philosophy, psychiatry."
                     :whenAgi      2040
                     :agiDoom      80}
                    {:userid  "weidai11"
                     :message "Cryptographer and AI Alignment Theorist"
                     :aiRisk  true
                     :whenAgi 2045
                     :agiDoom 80}
                    {:userid  "TheZvi"
                     :message "Card game designer, MTG expert, and rationalist blogger"
                     :whenAgi 2065
                     :agiDoom 94}
                    {:userid  "LaurentOrseau"
                     :message "DeepMind Technologies Limited. Mathématiques et Informatique Appliquées, Paris. AI alignment theorist."
                     :aiRisk  true
                     :whenAgi 2032
                     :agiDoom 6}
                    {:userid       "sama"
                     :message      "CEO, OpenAI"
                     :aiResearcher true
                     :whenAgi      2033
                     :agiDoom      20}
                    {:userid       "demishassabis"
                     :message      "Founder & CEO DeepMind. Working on General AI & modelling biology. Trying to understand the fundamental nature of reality."
                     :aiResearcher true
                     :whenAgi      2033
                     :agiDoom      45}
                    {:userid  "jackclarkSF"
                     :message "AnthropicAI, ONEAI OECD, co-chair indexingai, writer importai.net"
                     :aiRisk  true
                     :whenAgi 2037
                     :agiDoom 50}
                    {:userid  "elonmusk"
                     :message "Mars & Cars, Chips & Dips"
                     :whenAgi 2029
                     :agiDoom 28}
                    {:userid       "ShaneLegg"
                     :message      "Chief Scientist and Co-Founder, DeepMind"
                     :aiResearcher true
                     :whenAgi      2030
                     :agiDoom      75}
                    {:userid  "AnnaWSalamon"
                     :message "Executive Director, Center for Applied Rationality"
                     :aiRisk  true
                     :whenAgi 2034
                     :agiDoom 95}
                    {:userid  "DKokotajlo"
                     :message "Philosophy PhD student, worked at AI Impacts, then Center on Long-Term Risk, now OpenAI Futures/Governance team. "
                     :aiRisk  true
                     :whenAgi 2028
                     :agiDoom 70}
                    {:userid       "gwern"
                     :message      "writer, self-experimenter, and programmer"
                     :aiResearcher true
                     :whenAgi      2031
                     :agiDoom      96}
                    {:userid  "So8res"
                     :message "Nate Soares is the Executive Director of the Machine Intelligence Research Institute"
                     :aiRisk  true
                     :whenAgi 2036
                     :agiDoom 97}
                    {:userid  "ESYudkowsky"
                     :message "Ours is the era of inadequate AI alignment theory. Any other facts about this era are relatively unimportant, but sometimes I tweet about them anyway."
                     :aiRisk  true
                     :whenAgi 2029
                     :agiDoom 99}
                    {:userid       "alyssamvance"
                     :message      "Conversational AI engineer, futurist, neophile, machine explorer"
                     :aiResearcher true
                     :whenAgi      2045
                     :agiDoom      75}
                    {:userid  "MichaelTrazzi"
                     :message "Safety maximalist. Alignment is what you need."
                     :aiRisk  true
                     :whenAgi 2027
                     :agiDoom 93}
                    {:userid       "tyrell_turing"
                     :message      "Researcher in Montréal, @MILAMontreal and @mcgillu, combining machine learning and neuroscience."
                     :aiResearcher true
                     :whenAgi      2074
                     :agiDoom      4}
                    {:userid       "deepfates"
                     :message      "Digital Prophet"
                     :aiResearcher true
                     :whenAgi      2035	
                     :agiDoom      36}
                    {:userid  "bryan_caplan"
                     :message "GMU econ prof, NYT bestseller, father of 4, author of Myth of the Rational Voter, Selfish Reasons to Have More Kids, Case Against Education, and Open Borders."
                     :whenAgi 2300
                     :agiDoom 30}
                    {:userid       "SchmidhuberAI"
                     :message      "Self-improving AI that learns to learn (1987-). Our deep learning neural networks are used many billions of times per day on 3+ billion devices."
                     :aiResearcher true
                     :whenAgi      2030
                     :agiDoom      0}
                    {:userid       "TheDavidSJ"
                     :message      "Studying math and machine learning. Former guidance and navigation software for first stage landing @ SpaceX."
                     :aiResearcher true
                     :whenAgi      2030
                     :agiDoom      30}
                    {:userid  "William_Kiely"
                     :message "Excited about humanity prioritizing securing a very long-lasting, very postive future this century."
                     :whenAgi 2060
                     :agiDoom 65}
                    {:userid  "Telofy"
                     :message "Borrowing against utopias."
                     :whenAgi 2040
                     :agiDoom 74}
                    {:userid  "benwr"
                     :message "Writes software and does research, often aimed at improving or saving the world. Loves thinking about artificial intelligence, philosophy, cryptography, and robotics."
                     :whenAgi 2035 
                     :agiDoom 75}
                    {:userid  "RatOrthodox"
                     :message "Trying to figure stuff out and make stuff good. Aspiring rationalist. Phil grad student. Despite my efforts my tweets are caused in part by twitter incentives."
                     :whenAgi 2040
                     :agiDoom 100}
                    {:userid  "OHaggstrom"
                     :message "Concerned world citizen and professor of mathematical statistics (in that order)."
                     :whenAgi 2035
                     :agiDoom 90}
                    {:userid  "kmett"
                     :message "Head of Software @GroqInc. Building @ToposInstitute and @HaskellFound. Formerly @MIRIBerkeley"
                     :whenAgi 2031
                     :agiDoom 98}
                    {:userid  "robertskmiles"
                     :message "Machine learning. Artificial intelligence. Data science ; Physics. Information security. Python ; Cloud computing. Internet of things. Futurology ; Philosophy."
                     :aiRisk  true
                     :whenAgi 2029
                     :agiDoom 85}
                    {:userid       "davidad"
                     :message      "wordcloud: randomized social choice—causal modeling—string diagrams—AI strategy"
                     :aiResearcher true
                     :whenAgi      2033
                     :agiDoom      75}
                    {:userid  "WeakInteraction"
                     :message "Cyclist, effective altruist, and former physicist. These days I'm trying to figure out what fate will befall us if we don't take AI seriously enough."
                     :aiRisk  true
                     :whenAgi 2057
                     :agiDoom 77}
                    {:userid       "jacyanthis"
                     :message      "PhD student in machine learning @UChicago @SentienceInst. Author. Utilitarian. Longtermist. Positivist."
                     :aiResearcher true
                     :whenAgi      2054
                     :agiDoom      29}
                    {:userid       "peterwildeford"
                     :message      "Co-CEO @RethinkPriors. Top 30 @metaculus. Tweets on AI, forecasting, effective altruism. Join me on my journey to learn about the world."
                     :aiResearcher true
                     :whenAgi      2054
                     :agiDoom      20}
                    {:userid  "NPCollapse"
                     :message "Hacker - Conjecture - EleutherAI - I don't know how to save the world, but dammit I'm gonna try"
                     :aiRisk  true
                     :whenAgi 2028
                     :agiDoom 95}
                    {:userid       "Kaden_Wolff"
                     :message      "Musician, Functional Programming+NLP, Absurdist, Aspiring Rationalist"
                     :aiResearcher true
                     :whenAgi      2038
                     :agiDoom      22}
                    {:userid  "robbensinger"
                     :message "Comms czar @MIRIBerkeley"
                     :aiRisk  true
                     :whenAgi 2032
                     :agiDoom 99.5}
                    {:userid       "ID_AA_Carmack"
                     :message      "Creator of the Doom video game, now AGI researcher at Keen Technologies"
                     :aiResearcher true
                     :whenAgi      2035
                     :agiDoom      10}])

(defn fill-starting-data []
  (doseq [{:keys [userid
                  message
                  aiResearcher
                  aiRisk
                  whenAgi
                  agiDoom]
           :as   avatar}
          starting-data]
    (println userid)
    (ss/add-object {:user/userid       userid
                    :user/x            (+ (* 20 (closest-range-match whenAgi time-range)) -1000)
                    :user/y            (+ (* 20 (closest-range-match agiDoom risk-range)) -1000)
                    :user/followers    (tw/num-followers userid)
                    :user/aiResearcher aiResearcher
                    :user/aiRisk       aiRisk
                    :user/expert       (not (or aiResearcher aiRisk))
                    :user/message      message})
    (sc/fetch-avatar userid)))
