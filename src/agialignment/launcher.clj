(ns agialignment.launcher
  (:require [agialignment.agialignment :as ez]
            [agialignment.scraper :as sc]))

(ez/permanent-database!)
(ez/start-server)

