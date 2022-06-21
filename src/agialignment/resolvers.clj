(ns agialignment.resolvers
  (:require [fbc-utils.core :as ut]
            [datahike.api :as dh]
            [com.walmartlabs.lacinia.schema :as sc]
            [super-server.super-server :as ss]
            [agialignment.twitter :as tw]))

(defn session-user-id [{:keys [request]
                        :as   context}]
  (:userid @(:session-response request)))

(defn get-avatar [db eid]
  (let [{:keys [:user/userid      
                :user/x           
                :user/y           
                :user/followers   
                :user/aiResearcher
                :user/aiRisk]
         :as   avatar} (dh/entity db eid)]
    {:id           (str "avatar:" eid)
     :userid       userid
     :x            x
     :y            y
     :followers    followers
     :aiResearcher aiResearcher
     :aiRisk       aiRisk}))

(defn app [db
           {:keys [request]
            :as   context}
           {:keys [oauthToken
                   oauthVerifier]
            :as   args}
           value]
  (let [{:keys [session-response]} request]
    (when-let [{:keys [screen_name]
                :as   response} #d (tw/signup-response oauthToken oauthVerifier)]
      (reset! session-response {:userid #d screen_name}))
    {:id     "app:0"
     :userid #d (:userid @session-response)}))

(defn app-avatars [db context args value]
  (let [eids (map first (dh/q '[:find ?e :where [?e :user/userid ?n]] @db))]
    (map (partial get-avatar @db) eids)))

(defn url [db context args value]
  (tw/per-user-signup-url))
