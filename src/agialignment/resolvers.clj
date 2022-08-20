(ns agialignment.resolvers
  (:require [fbc-utils.core :as ut]
            [datahike.api :as dh]
            [com.walmartlabs.lacinia.schema :as sc]
            [super-server.super-server :as ss]
            [agialignment.twitter :as tw]
            [agialignment.scraper :as sr]
            [clojure.java.io :as io]
            [clj-http.client :as cl]))

(def admin-userid "lisperati")

(defn session-userid [request]
  #_admin-userid
  (when-let [session (:session-response request)]
    (:userid @session)))

(defn adjusted-userid [{:keys [request]
                        :as   context}
                       {:keys [useridOverride]
                        :as   args}]
  (let [userid (session-userid request)]
    (if (= userid admin-userid)
      (or useridOverride userid)
      userid)))

(defn add-object [db obj]
  (dh/transact db
               (for [[k v] obj]
                 [:db/add -1 k v])))

(defn secrets []
  (read-string (slurp "secret_keys.edn")))

(defn fetch-followers [username]
  (get-in (cl/get (str "https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=" username) {:as :json}) [:body 0 :followers_count]))

(defn get-avatar [db eid]
  (let [{:keys [:user/userid      
                :user/x           
                :user/y           
                :user/followers   
                :user/aiResearcher
                :user/aiRisk
                :user/expert
                :user/message]
         :as   avatar} (dh/entity db eid)]
    {:id           (str "avatar:" eid)
     :userid       userid
     :x            x
     :y            y
     :followers    followers
     :aiResearcher aiResearcher
     :aiRisk       aiRisk
     :expert       expert
     :message      message}))

(defn get-avatar-eid [db userid]
  (let [[[eid]] (seq (dh/q '[:find ?e
                             :in $ ?userid
                             :where [?e :user/userid ?userid]]
                           db
                           userid))]
    eid))

(defn add-avatar-helper [db userid]
  (when userid
    (when-not (get-avatar-eid @db userid)
      (sr/fetch-avatar (name userid))
      (let [followers (fetch-followers (name userid))]
        (add-object db
                    {:user/userid       userid
                     :user/x            0
                     :user/y            0
                     :user/followers    (long followers)
                     :user/aiResearcher false
                     :user/aiRisk       false
                     :user/message      ""})))))

(defn app [db
           {:keys [request]
            :as   context}
           {:keys [oauthToken
                   oauthVerifier]
            :as   args}
           value]
  (let [{:keys [session-response]} request]
    (when oauthToken
      (when-let [{:keys [screen_name]
                  :as   response} (tw/signup-response oauthToken oauthVerifier)]
        (reset! session-response {:userid screen_name}))
      (let [userid (adjusted-userid context args)]
        (add-avatar-helper db userid)))
    {:id     "app:0"
     :userid (session-userid request)}))

(defn app-avatars [db context args value]
  (let [eids (map first (dh/q '[:find ?e :where [?e :user/userid ?n]] @db))]
    (map (partial get-avatar @db) eids)))

(defn url [db context args value]
  (tw/per-user-signup-url))

(defn update-avatar [db
                     context
                     {:keys [aiResearcher
                             aiRisk
                             message]
                      :as   args}
                     value]
  (assert (<= (count message) 500))
  (when-let [userid (adjusted-userid context args)]
    (when-let [eid (get-avatar-eid @db userid)]
      (dh/transact db
                   [[:db/add eid :user/aiResearcher aiResearcher]
                    [:db/add eid :user/aiRisk aiRisk]
                    [:db/add eid :user/message message]])
      (get-avatar @db eid))))

(defn add-avatar [db
                  {:keys [request]
                   :as   context}
                  args
                  value]
  (when-let [userid (adjusted-userid context args)]
    (add-avatar-helper db userid))
  {:id     "app:0"
   :userid (session-userid request)})

(defn delete-avatar [db
                     {:keys [request]
                      :as   context}
                     args
                     value]
  (when-let [userid (adjusted-userid context args)]
    (dh/transact db [[:db.fn/retractEntity (get-avatar-eid @db userid)]]))
  {:id     "app:0"
   :userid (session-userid request)})

(defn update-avatar-position [db
                              context
                              {:keys [x
                                      y]
                               :as   args}
                              value]
  (when-let [userid (adjusted-userid context args)]
    (when-let [eid (get-avatar-eid @db userid)]
      (dh/transact db
                   [[:db/add eid :user/x x]
                    [:db/add eid :user/y y]])
      (get-avatar @db eid))))
