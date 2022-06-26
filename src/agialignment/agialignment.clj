(ns agialignment.agialignment
  (:require [fbc-utils.debug]
            [datahike.api :as dh]
            [super-server.super-server :as ss]
            [agialignment.resolvers :as re]
            [agialignment.twitter :as tw]))

(def db-schema {:user/userid       :string
                :user/x            :bigint
                :user/y            :bigint
                :user/followers    :long
                :user/aiResearcher :boolean
                :user/aiRisk       :boolean
                :user/decline      :boolean
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
                                                        :aiRisk       {:type 'Boolean}}}}
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
                                                                   :decline        {:type 'Boolean}
                                                                   :message        {:type 'String}}
                                                         :resolve #'re/update-avatar}
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
  (ss/permanent-database! db-schema))

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
;;(permanent-database!)
;;(start-server-local-react)
;;(start-server)

