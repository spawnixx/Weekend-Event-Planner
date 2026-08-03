import { useState } from "react";

export default function TicketmasterBrowser({
  groupId,
  groupEvents = [],
  onEventAdded,
}) {
  const [keyword, setKeyword] = useState("");
  const [city, setCity] = useState("");
  const [results, setResults] = useState([]);
  const [pageData, setPageData] = useState({
    number: 0,
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
}
