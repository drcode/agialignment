(ns agialignment.scraper
  (:require [etaoin.api :as ea]
            [etaoin.keys :as ek]
            [clojure.java.io :as io]
            [fbc-utils.debug]))

#_(defonce driver-atom (atom nil))

#_(defn driver []
    (or @driver-atom
        (reset! driver-atom
                (ea/chrome {:headless true
                            :args     ["--no-sandbox"]}))))

(defn copy [uri file]
  (with-open [in  (io/input-stream uri)
              out (io/output-stream file)]
    (io/copy in out)))

(defn fetch-avatar [username]
  (ea/with-chrome {:headless true
                   :args     ["--no-sandbox"]}
    driver
    (ea/go driver  (str "https://twitter.com/" username))
    (ea/wait-exists driver {:css "a[href$='/photo'] img[src]"})
    (let [url  (ea/get-element-attr driver {:css "a[href$='/photo'] img[src]"} :src)]
      (copy url (str "resources/public/avatars/" username)))))
