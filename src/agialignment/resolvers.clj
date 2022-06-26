(ns agialignment.resolvers
  (:require [fbc-utils.core :as ut]
            [datahike.api :as dh]
            [com.walmartlabs.lacinia.schema :as sc]
            [super-server.super-server :as ss]
            [agialignment.twitter :as tw]))

(def admin-userid "lisperati")

(defn session-userid [{:keys [request]
                       :as   context}]
  admin-userid
  #_(:userid @(:session-response request)))

(defn adjusted-userid [{:keys [request]
                        :as   context}
                       {:keys [useridOverride]
                        :as   args}]
  (let [userid (session-user-id request)]
    (if (= userid admin-userid)
      (or useridOverride userid)
      userid)))

(defn add-object [db obj]
  (dh/transact db
               (for [[k v] obj]
                 [:db/add -1 k v])))

(defn get-avatar [db eid]
  (let [{:keys [:user/userid      
                :user/x           
                :user/y           
                :user/followers   
                :user/aiResearcher
                :user/aiRisk
                :user/decline
                :user/message]
         :as   avatar} (dh/entity db eid)]
    {:id           (str "avatar:" eid)
     :userid       userid
     :x            x
     :y            y
     :followers    followers
     :aiResearcher aiResearcher
     :aiRisk       aiRisk
     :decline      decline
     :message      message}))

(defn get-avatar-eid [db userid]
  (let [[[eid]] (seq (dh/q '[:find ?e
                             :in $ ?userid
                             :where [?e :user/userid ?userid]]
                           db
                           userid))]
    eid))

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
        (reset! session-response {:userid screen_name})))
    (let [userid (adjusted-userid context args)]
      (when userid
        (when-not (get-avatar-eid @db userid)
          (add-object db
                      {:user/userid       userid
                       :user/x            0
                       :user/y            0
                       :user/followers    0
                       :user/aiResearcher false
                       :user/aiRisk       false
                       :user/decline      false
                       :user/message      ""})))
      {:id     "app:0"
       :userid userid})))

(defn app-avatars [db context args value]
  (let [eids (map first (dh/q '[:find ?e :where [?e :user/userid ?n]] @db))]
    (map (partial get-avatar @db) eids)))

(defn url [db context args value]
  (tw/per-user-signup-url))

(defn update-avatar [db
                     context
                     {:keys [aiResearcher
                             aiRisk
                             decline
                             message]
                      :as   args}
                     value]
  (when-let [userid (adjusted-userid context args)]
    (when-let [eid (get-avatar-eid @db userid)]
      (dh/transact db
                   [[:db/add eid :user/aiResearcher aiResearcher]
                    [:db/add eid :user/aiRisk aiRisk]
                    [:db/add eid :user/decline decline]
                    [:db/add eid :user/message message]])
      (get-avatar eid))))

(defn update-avatar-position [db
                              context
                              {:keys [x
                                      y]
                               :as   args}
                              value]
  #d args
  (when-let [userid #d (adjusted-userid context args)]
    (when-let [eid #d (get-avatar-eid @db userid)]
      #d (dh/transact db
                      [[:db/add eid :user/x x]
                       [:db/add eid :user/y y]])
      #d 
      (get-avatar @db eid))))
