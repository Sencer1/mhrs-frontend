import React, { useMemo, useState, useEffect } from "react";
import BackButton from "../components/common/BackButton";
import PageContainer from "../components/layout/PageContainer";

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

type DoctorOption = {
  id: string;
  name: string;
  departmentId: string;
  slots: string[];
};

type DoctorWithState = {
  id: string;
  name: string;
  departmentId: string;
  slots: {
    time: string;
    isBooked: boolean;
  }[];
};

// MOCK DATA – backend geldiğinde bunlar API çağrısına taşınacak
const cities: City[] = [
  { id: "ankara", name: "Ankara" },
  { id: "istanbul", name: "İstanbul" },
  { id: "izmir", name: "İzmir" },
];

const hospitals: HospitalOption[] = [
  { id: "h1", name: "Ankara Şehir Hastanesi", cityId: "ankara" },
  { id: "h2", name: "Ankara Eğitim ve Araştırma", cityId: "ankara" },
  { id: "h3", name: "İstanbul Şehir Hastanesi", cityId: "istanbul" },
];

const departments: DepartmentOption[] = [
  { id: "d1", name: "Kardiyoloji", hospitalId: "h1" },
  { id: "d2", name: "Dahiliye", hospitalId: "h1" },
  { id: "d3", name: "Ortopedi", hospitalId: "h2" },
  { id: "d4", name: "Kardiyoloji", hospitalId: "h3" },
];

const doctorMocks: DoctorOption[] = [
  {
    id: "doc1",
    name: "Dr. Ahmet Yılmaz",
    departmentId: "d1",
    slots: ["09:00", "09:30", "10:00"],
  },
  {
    id: "doc2",
    name: "Dr. Elif Demir",
    departmentId: "d2",
    slots: ["11:00", "11:30"],
  },
  {
    id: "doc3",
    name: "Dr. Mehmet Kara",
    departmentId: "d4",
    slots: ["13:00", "13:30", "14:00"],
  },
];

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
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(
    null
  );
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    string | null
  >(null);

  const [doctors, setDoctors] = useState<DoctorWithState[]>(
    doctorMocks.map((d) => ({
      id: d.id,
      name: d.name,
      departmentId: d.departmentId,
      slots: d.slots.map((s) => ({ time: s, isBooked: false })),
    }))
  );

  // Tarih değişince tüm seçimleri ve slotları resetle
  useEffect(() => {
    setSelectedCityId(null);
    setSelectedHospitalId(null);
    setSelectedDepartmentId(null);
    setDoctors(
      doctorMocks.map((d) => ({
        id: d.id,
        name: d.name,
        departmentId: d.departmentId,
        slots: d.slots.map((s) => ({ time: s, isBooked: false })),
      }))
    );
  }, [selectedDate]);

  const filteredHospitals = useMemo(
    () => hospitals.filter((h) => h.cityId === selectedCityId),
    [selectedCityId]
  );

  const filteredDepartments = useMemo(
    () => departments.filter((d) => d.hospitalId === selectedHospitalId),
    [selectedHospitalId]
  );

  const filteredDoctors = useMemo(
    () => doctors.filter((d) => d.departmentId === selectedDepartmentId),
    [doctors, selectedDepartmentId]
  );

  const allDoctorsFull =
    filteredDoctors.length > 0 &&
    filteredDoctors.every((doc) => doc.slots.every((s) => s.isBooked));

  const handleBookSlot = (doctorId: string, time: string) => {
    if (!selectedDate) {
      alert("Lütfen önce tarih seçiniz.");
      return;
    }

    const ok = window.confirm(
      `${selectedDate} tarihli, saat ${time} için randevu almak istiyor musunuz?`
    );
    if (!ok) return;

    // TODO: burada backend'e POST /api/appointments ile randevu isteği atılacak
    setDoctors((prev) =>
      prev.map((doc) =>
        doc.id === doctorId
          ? {
              ...doc,
              slots: doc.slots.map((s) =>
                s.time === time ? { ...s, isBooked: true } : s
              ),
            }
          : doc
      )
    );
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
          disabled={!selectedDate}
        />

        <SearchableSelect
          label="Hastane"
          items={filteredHospitals}
          selectedId={selectedHospitalId}
          onSelect={(id) => {
            setSelectedHospitalId(id);
            setSelectedDepartmentId(null);
          }}
          disabled={!selectedDate || !selectedCityId}
        />

        <SearchableSelect
          label="Departman"
          items={filteredDepartments}
          selectedId={selectedDepartmentId}
          onSelect={(id) => {
            setSelectedDepartmentId(id);
          }}
          disabled={!selectedDate || !selectedHospitalId}
        />
      </div>

      {/* Doktor + slot listesi */}
      {selectedDepartmentId && selectedDate && (
        <div>
          <h3 style={{ marginBottom: "12px" }}>Doktor ve Saat Seçimi</h3>

          {filteredDoctors.length === 0 && (
            <p style={{ color: "#666" }}>
              Bu departmanda görüntülenecek doktor bulunamadı.
            </p>
          )}

          {filteredDoctors.map((doc) => {
            const allSlotsBooked = doc.slots.every((s) => s.isBooked);
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
                  {doc.slots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={slot.isBooked || allSlotsBooked}
                      onClick={() => handleBookSlot(doc.id, slot.time)}
                      style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #1976d2",
                        backgroundColor: slot.isBooked
                          ? "#e0e0e0"
                          : "#e3f2fd",
                        color: slot.isBooked ? "#777" : "#000",
                        cursor:
                          slot.isBooked || allSlotsBooked
                            ? "not-allowed"
                            : "pointer",
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
