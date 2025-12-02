// src/pages/PatientNewAppointmentPage.tsx
import React, { useMemo, useState, useEffect } from "react";
import BackButton from "../components/common/BackButton";
import PageContainer from "../components/layout/PageContainer";
import { getCities, searchHospitals } from "../services/hospitalService";
import { getDepartmentsByHospital } from "../services/departmentService";
import {
  getDoctorsByDepartment,
  getDoctorSlots,
} from "../services/doctorService";
import { bookAppointment } from "../services/patientService";

type PatientNewAppointmentPageProps = {
  onBack: () => void;
};

type City = {
  id: string;
  name: string;
};

type HospitalOption = {
  id: string;
  name: string;
  cityId: string;
};

type DepartmentOption = {
  id: string;
  name: string;
  hospitalId: string;
};

type DoctorWithState = {
  id: string; // doctorNationalId
  name: string;
  departmentId: string;
  hospitalId: string;
  slots: {
    appointmentId: number;
    time: string; // "HH:mm"
    isBooked: boolean;
  }[];
};

type SearchableSelectProps<T extends { id: string; name: string }> = {
  label: string;
  items: T[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
};

function SearchableSelect<T extends { id: string; name: string }>({
  label,
  items,
  selectedId,
  onSelect,
  disabled,
}: SearchableSelectProps<T>) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filtered = useMemo(() => {
    const sorted = [...items].sort((a, b) =>
      a.name.localeCompare(b.name, "tr-TR")
    );
    const q = query.toLocaleLowerCase("tr-TR");
    if (!q) return sorted;
    return sorted.filter((it) =>
      it.name.toLocaleLowerCase("tr-TR").includes(q)
    );
  }, [items, query]);

  const selectedItem = items.find((i) => i.id === selectedId) || null;

  return (
    <div style={{ marginBottom: "16px" }}>
      <div
        style={{
          marginBottom: "4px",
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        style={{
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "8px 10px",
          backgroundColor: disabled ? "#f2f2f2" : "#f8f8f8",
          cursor: disabled ? "not-allowed" : "pointer",
        }}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
      >
        <div style={{ fontWeight: 600 }}>
          {selectedItem ? selectedItem.name : `${label} seçiniz`}
        </div>
        {isOpen && !disabled && (
          <input
            type="text"
            placeholder={`${label} yazabilirsiniz...`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              marginTop: "6px",
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
            }}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
      {isOpen && !disabled && (
        <div
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            marginTop: "4px",
            maxHeight: "180px",
            overflowY: "auto",
            backgroundColor: "white",
            zIndex: 10,
          }}
        >
          {filtered.map((it) => (
            <div
              key={it.id}
              style={{
                padding: "8px 10px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
              }}
              onClick={() => {
                onSelect(it.id);
                setIsOpen(false);
                setQuery("");
              }}
            >
              {it.name}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "8px 10px", color: "#777" }}>
              Sonuç bulunamadı.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const PatientNewAppointmentPage: React.FC<PatientNewAppointmentPageProps> = ({
  onBack,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const today = new Date().toISOString().split("T")[0];
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(
    null
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);

  const [cities, setCities] = useState<City[]>([]);
  const [hospitals, setHospitals] = useState<HospitalOption[]>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [doctors, setDoctors] = useState<DoctorWithState[]>([]);

  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingHospitals, setLoadingHospitals] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Şehirleri backend'den çek
  useEffect(() => {
    let cancelled = false;

    const loadCities = async () => {
      try {
        setLoadingCities(true);
        setError(null);
        const cityNames = await getCities();
        if (cancelled) return;

        setCities(
          cityNames.map((name: string) => ({
            id: name,
            name,
          }))
        );
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Şehirler yüklenirken bir hata oluştu.");
        }
      } finally {
        if (!cancelled) {
          setLoadingCities(false);
        }
      }
    };

    loadCities();

    return () => {
      cancelled = true;
    };
  }, []);

  // Tarih değişince tüm seçimleri ve slotları resetle
  useEffect(() => {
    setSelectedCityId(null);
    setSelectedHospitalId(null);
    setSelectedDepartmentId(null);
    setHospitals([]);
    setDepartments([]);
    setDoctors([]);
  }, [selectedDate]);

  // Şehir değişince hastaneleri backend'den çek
  useEffect(() => {
    if (!selectedDate || !selectedCityId) {
      setHospitals([]);
      return;
    }

    let cancelled = false;

    const loadHospitals = async () => {
      try {
        setLoadingHospitals(true);
        setError(null);

        const hospitalList = await searchHospitals({
          city: selectedCityId,
          district: null,
        });
        if (cancelled) return;

        setHospitals(
          hospitalList.map((h: any) => ({
            id: String(h.hospitalId),
            name: h.name,
            cityId: h.city,
          }))
        );
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError("Hastaneler yüklenirken bir hata oluştu.");
        }
      } finally {
        if (!cancelled) {
          setLoadingHospitals(false);
        }
      }
    };

    loadHospitals();

    return () => {
      cancelled = true;
    };
  }, [selectedCityId, selectedDate]);

  // Hastane değişince departmanları backend'den çek
  useEffect(() => {
    if (!selectedHospitalId || !selectedDate) {
      setDepartments([]);
      return;
    }

    let canceled = false;

    const loadDepartmentsEffect = async () => {
      try {
        setLoadingDepartments(true);
        const data = await getDepartmentsByHospital(selectedHospitalId);

        if (canceled) return;

        setDepartments(
          data.map((d: any) => ({
            id: String(d.departmentId),
            name: d.branchName,
            hospitalId: String(selectedHospitalId),
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        if (!canceled) setLoadingDepartments(false);
      }
    };

    loadDepartmentsEffect();

    return () => {
      canceled = true;
    };
  }, [selectedHospitalId, selectedDate]);

  // Departman + tarih değişince doktorları ve slotlarını backend'den çek
  useEffect(() => {
    if (!selectedDepartmentId || !selectedDate) {
      setDoctors([]);
      return;
    }

    let canceled = false;

    const loadDoctorsAndSlots = async () => {
      try {
        setLoadingDoctors(true);

        // 1) Doktor listesi
        const doctorList = await getDoctorsByDepartment(selectedDepartmentId);
        if (canceled) return;

        const baseDoctors: DoctorWithState[] = doctorList.map((d) => ({
          id: String(d.doctorNationalId),
          name: `${d.firstName} ${d.lastName}`,
          departmentId: String(d.departmentId),
          hospitalId: String(d.hospitalId),
          slots: [],
        }));

        setDoctors(baseDoctors);

        // 2) Her doktor için slotları çek
        const slotPromises = doctorList.map((d) =>
          getDoctorSlots(d.doctorNationalId, selectedDate).then((slots) => ({
            doctorId: String(d.doctorNationalId),
            slots,
          }))
        );

        const slotResults = await Promise.all(slotPromises);
        if (canceled) return;

        setDoctors((prev) =>
          prev.map((doc) => {
            const match = slotResults.find((r) => r.doctorId === doc.id);
            if (!match) return doc;

            const mappedSlots =
              match.slots?.map((s) => ({
                appointmentId: s.appointmentId,
                time: s.slotDateTime.slice(11, 16), // "HH:mm"
                isBooked: s.status === "booked",
              })) ?? [];

            return { ...doc, slots: mappedSlots };
          })
        );
      } catch (err) {
        console.error(err);
      } finally {
        if (!canceled) setLoadingDoctors(false);
      }
    };

    loadDoctorsAndSlots();

    return () => {
      canceled = true;
    };
  }, [selectedDepartmentId, selectedDate]);

  const filteredHospitals = useMemo(() => hospitals, [hospitals]);
  const filteredDepartments = departments;
  const filteredDoctors = useMemo(
    () => doctors.filter((d) => d.departmentId === selectedDepartmentId),
    [doctors, selectedDepartmentId]
  );

  const allDoctorsFull =
    filteredDoctors.length > 0 &&
    filteredDoctors.every((doc) => doc.slots.every((s) => s.isBooked));

  const handleBookSlot = async (
  doctorId: string,
  appointmentId: number,
  time: string
) => {
  if (!selectedDate) {
    alert("Lütfen önce tarih seçiniz.");
    return;
  }

  const ok = window.confirm(
    `${selectedDate} tarihli, saat ${time} için randevu almak istiyor musunuz?`
  );
  if (!ok) return;

  try {
    // Backend'e randevu alma isteği
    await bookAppointment(appointmentId);

    // Frontend state'ini güncelle (slotu booked olarak işaretle)
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === doctorId
          ? {
              ...doc,
              slots: doc.slots.map((s) =>
                s.appointmentId === appointmentId
                  ? { ...s, isBooked: true }
                  : s
              ),
            }
          : doc
      )
    );
  } catch (err) {
    console.error(err);
    alert("Randevu alınırken bir hata oluştu.");
  }
};

  const handleJoinDoctorWaitList = (doctorId: string) => {
    // TODO: backend POST /api/waiting-list/doctor/{doctorId}
    alert(
      `Bu doktor için tüm randevular dolu. Bekleme listesine eklendiniz. (Mock)`
    );
  };

  const handleJoinDepartmentWaitList = () => {
    // TODO: backend POST /api/waiting-list/department/{departmentId}
    alert(
      "Bu departmandaki tüm doktorların randevuları dolu. Departman bekleme listesine eklendiniz. (Mock)"
    );
  };

  return (
    <PageContainer maxWidth={900}>
      <BackButton onClick={onBack} />

      <h2 style={{ marginBottom: "12px" }}>Randevu Alma</h2>
      <p style={{ marginBottom: "20px", color: "#555" }}>
        Lütfen önce tarih seçin, ardından il, hastane, departman ve doktor
        bilgilerini seçerek randevu almak istediğiniz saati belirleyin.
      </p>

      {error && (
        <div
          style={{
            marginBottom: "12px",
            padding: "8px 10px",
            borderRadius: "6px",
            border: "1px solid #dc3545",
            backgroundColor: "#f8d7da",
            color: "#842029",
            fontSize: "14px",
          }}
        >
          {error}
        </div>
      )}

      {/* Tarih seçimi */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{ fontWeight: 600, marginBottom: "4px", display: "block" }}
        >
          Tarih
        </label>
        <input
          type="date"
          value={selectedDate}
          min={today}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{
            padding: "8px 10px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {/* İl / Hastane / Departman */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "16px",
          marginBottom: "24px",
        }}
      >
        <SearchableSelect
          label="İl"
          items={cities}
          selectedId={selectedCityId}
          onSelect={(id) => {
            setSelectedCityId(id);
            setSelectedHospitalId(null);
            setSelectedDepartmentId(null);
          }}
          disabled={!selectedDate || loadingCities}
        />

        <SearchableSelect
          label="Hastane"
          items={filteredHospitals}
          selectedId={selectedHospitalId}
          onSelect={(id) => {
            setSelectedHospitalId(id);
            setSelectedDepartmentId(null);
          }}
          disabled={!selectedDate || !selectedCityId || loadingHospitals}
        />

        <SearchableSelect
          label="Departman"
          items={filteredDepartments}
          selectedId={selectedDepartmentId}
          onSelect={(id) => setSelectedDepartmentId(id)}
          disabled={!selectedDate || !selectedHospitalId || loadingDepartments}
        />
      </div>

      {/* Doktor + slot listesi */}
      {selectedDepartmentId && selectedDate && (
        <div>
          <h3 style={{ marginBottom: "12px" }}>Doktor ve Saat Seçimi</h3>

          {loadingDoctors && (
            <p style={{ color: "#666" }}>Doktorlar yükleniyor...</p>
          )}

          {!loadingDoctors && filteredDoctors.length === 0 && (
            <p style={{ color: "#666" }}>
              Bu departmanda görüntülenecek doktor bulunamadı.
            </p>
          )}

          {filteredDoctors.map((doc) => {
            const allSlotsBooked =
              doc.slots.length > 0 &&
              doc.slots.every((s) => s.isBooked);
            const departmentName =
              departments.find((d) => d.id === doc.departmentId)?.name || "";

            return (
              <div
                key={doc.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "12px 16px",
                  marginBottom: "12px",
                  backgroundColor: "#fafafa",
                  opacity: allSlotsBooked ? 0.5 : 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div>
                    <strong>{doc.name}</strong>
                    {departmentName && (
                      <span
                        style={{
                          marginLeft: "8px",
                          fontSize: "13px",
                          color: "#555",
                        }}
                      >
                        ({departmentName})
                      </span>
                    )}
                  </div>
                  {allSlotsBooked && (
                    <span style={{ color: "red", fontSize: "13px" }}>
                      Tüm randevular dolu
                    </span>
                  )}
                </div>

                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                >
                  {doc.slots.length === 0 && (
                    <span style={{ fontSize: "13px", color: "#777" }}>
                      Bu tarihte gösterilecek slot bulunamadı.
                    </span>
                  )}

                  {doc.slots.map((slot) => (
                      <button
                        key={slot.appointmentId}
                        disabled={slot.isBooked || allSlotsBooked}
                        onClick={() => handleBookSlot(doc.id, slot.appointmentId, slot.time)}
                        style={{
                          padding: "6px 10px",
                          borderRadius: "6px",
                          border: "1px solid #1976d2",
                          backgroundColor: slot.isBooked ? "#e0e0e0" : "#e3f2fd",
                          color: slot.isBooked ? "#777" : "#000",
                          cursor:
                            slot.isBooked || allSlotsBooked ? "not-allowed" : "pointer",
                          opacity: slot.isBooked ? 0.5 : 1,
                          fontSize: "13px",
                        }}
                      >
                        {slot.time}
                      </button>
                    ))}
                </div>

                {allSlotsBooked && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "8px 10px",
                      borderRadius: "6px",
                      backgroundColor: "#fff3cd",
                    }}
                  >
                    <p style={{ margin: 0, marginBottom: "8px" }}>
                      Bu doktor için tüm randevular dolu görünüyor.
                    </p>
                    <button
                      onClick={() => handleJoinDoctorWaitList(doc.id)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #555",
                        backgroundColor: "white",
                        cursor: "pointer",
                        fontSize: "13px",
                      }}
                    >
                      Bu doktor için bekleme listesine gir
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {allDoctorsFull && (
            <div
              style={{
                marginTop: "12px",
                padding: "8px 10px",
                borderRadius: "6px",
                backgroundColor: "#fff3cd",
              }}
            >
              <p style={{ margin: 0, marginBottom: "8px" }}>
                Bu departmandaki tüm doktorların randevuları dolu görünüyor.
              </p>
              <button
                onClick={handleJoinDepartmentWaitList}
                style={{
                  padding: "6px 10px",
                  borderRadius: "6px",
                  border: "1px solid #555",
                  backgroundColor: "white",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                Bu departman için bekleme listesine gir
              </button>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
};

export default PatientNewAppointmentPage;
