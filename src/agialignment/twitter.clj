(ns agialignment.twitter
  (:require [fbc-utils.core :as ut]
            [oauth.client :as oa]
            [fbc-utils.debug]
            [clj-http.client :as ht]
            [clojure.data.json :as js]))

(def consumer-atom (atom nil)) 

(def request-tokens (atom {}))

(defn secrets []
  (read-string (slurp "secret_keys.edn")))

(defn consumer []
  (when-not @consumer-atom
    (reset! consumer-atom
            (let [{:keys [consumer-key
                          consumer-secret]
                   :as   secrets} (secrets)]
              (oa/make-consumer consumer-key
                                consumer-secret
                                "https://api.twitter.com/oauth/request_token"
                                "https://api.twitter.com/oauth/access_token"
                                "https://api.twitter.com/oauth/authorize"
                                :hmac-sha1))))
  @consumer-atom)

(defn per-user-signup-url []
  (let [{:keys [oauth_token]
         :as   request-token} (oa/request-token (consumer) "https://agialignment.com/index.html")]
    (swap! request-tokens assoc oauth_token request-token)
    (oa/user-approval-uri (consumer) (:oauth_token request-token))))

(defn signup-response [oauth-token oauth-verifier] ;found in the url of the callback
  (let [request-token (@request-tokens oauth-token)]
    (swap! request-tokens dissoc oauth-token)
    (try (oa/access-token (consumer) request-token oauth-verifier)
         (catch Exception e
           (println (ex-message e))
           nil))))

(defn num-followers [screen-name]
  (:followers_count (first (js/read-str (:body (ht/get "https://cdn.syndication.twimg.com/widgets/followbutton/info.json" {:query-params {:screen_names screen-name}})) :key-fn keyword))))

(defn avatar [screen-name]
  (spit "dump.html" (:body (ht/get (str "https://twitter.com/" screen-name)))))

;;(per-user-signup-url)
;;(def response (signup-response "I38ApwAAAAABd4ZOAAABgXRhF3E" "J7Gc0MXg7xT525HvZoeUShfib9QtmPrn"))
;;(num-followers "lisperati")
